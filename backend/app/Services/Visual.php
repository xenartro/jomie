<?php

namespace App\Services;

use Auth;
use App\Models\Font;
use App\Models\Palette;
use App\Models\User;
use App\Models\VisualSetting;
use Exception;
use DB;

class Visual
{
    private User $user;
    public function __construct(User | null $user = null)
    {
        $this->user = $user !== null && $user->id ? $user : Auth::user();
    }

    public function getUserSettings()
    {
        $settings = VisualSetting::findFromUser($this->user, false);
        if (!$settings) {
            $settings = VisualSetting::findFromUser($this->user, true);
        }
        if (!$settings) {
            $settings = VisualSetting::createDefault($this->user);
        }
        return $settings;
    }

    public function getPalettes()
    {
        return Palette::whereNull('user_id')->orWhere('user_id', $this->user->id)->get();
    }

    public function getFonts()
    {
        return Font::whereNull('user_id')->orWhere('user_id', $this->user->id)->get();
    }

    public function saveVisualSettings(array $data)
    {
        $publishedSettings = VisualSetting::findFromUser($this->user, true);
        $unpublishedSettings = VisualSetting::findFromUser($this->user, false);
        if (!$unpublishedSettings) {
            $unpublishedSettings = VisualSetting::clonePublished($publishedSettings);
        }

        $unpublishedSettings->fill($data);
        $unpublishedData = $unpublishedSettings->toArray();
        unset($unpublishedData['published']);
        $publishedSettings->fill($unpublishedData);

        if (!$publishedSettings->isDirty(array_keys($unpublishedSettings->toArray()))) {
            $unpublishedSettings->delete();
            return;
        }

        if (!$unpublishedSettings->isDirty(array_keys($data))) {
            throw new MutationException('Visual', 204);
        }

        $unpublishedSettings->save();
    }

    /*
     * Palette
     */
    public function createPalette(array $data)
    {
        return Palette::saveFromData($this->user, $data);
    }

    public function isCurrentPalette(int $id)
    {
        return VisualSetting::isCurrentPalette($this->user, $id);
    }

    public function deletePalette(int $id)
    {
        if ($this->isCurrentPalette($id)) {
            throw new MutationException('Palette in use', 409);
        }
        $palette = Palette::getPalette($this->user, $id);
        if (!$palette) {
            throw new MutationException('Visual', 404);
        }
        $palette->delete();
    }

    public function updatePalette(array $data)
    {
        $palette = Palette::getPalette($this->user, $data['id']);
        if (!$palette) {
            throw new MutationException('Visual', 404);
        }
        Palette::saveFromData($this->user, $data);
    }

    public function getPalette(int $id)
    {
        return Palette::getPalette($this->user, $id);
    }

    public function getPalettePreview(int $id)
    {
        $userId = $this->user->id;
        return Palette::where('id', $id)
            ->where(function ($query) use ($userId) {
                $query->whereNull('user_id')
                    ->orWhere('user_id', $userId);
            })
            ->first();
    }

    /**
     * Type
     */
    public function createType(array $data)
    {
        return Font::saveFromData($this->user, $data);
    }

    public function isCurrentType(int $id)
    {
        return VisualSetting::isCurrentType($this->user, $id);
    }

    public function deleteType(int $id)
    {
        if ($this->isCurrentType($id)) {
            throw new MutationException('Type in use', 409);
        }
        $palette = Font::getType($this->user, $id);
        if (!$palette) {
            throw new MutationException('Visual', 404);
        }
        $palette->delete();
    }

    public function updateType(array $data)
    {
        $palette = isset($data['id']) ? Font::getType($this->user, $data['id']) : null;
        if (!$palette) {
            throw new MutationException('Visual', 404);
        }
        Font::saveFromData($this->user, $data);
    }

    public function getType(int $id)
    {
        return Font::getType($this->user, $id);
    }

    public function getTypePreview(int $id)
    {
        $userId = $this->user->id;
        return Font::where('id', $id)
            ->where(function ($query) use ($userId) {
                $query->whereNull('user_id')
                    ->orWhere('user_id', $userId);
            })
            ->first();
    }

    /**
     * Render preview
     */
    public function render(bool $published, $effect = '')
    {
        $settings = $this->getUserSettings();
        $loadingEffect = $effect || $effect === '0' ? VisualSetting::resolveLoadingEffect(intval($effect)) : $settings->loading_effect;
        return [
            'palette'        => $settings->palette->toArray(),
            'fonts'          => $settings->font->render(),
            'loading_effect' => $loadingEffect,
        ];
    }

    /**
     * Metadata
     */
    public function unpublishedContents()
    {
        $unpublished = [];

        $settings = $this->getUserSettings();
        if ($settings->published) {
            return [];
        }
        $publishedSettings = VisualSetting::findFromUser($this->user, true);
        if ($settings->palette_id !== $publishedSettings->palette_id) {
            $unpublished[] = 'palette';
        }
        if ($settings->font_id !== $publishedSettings->font_id) {
            $unpublished[] = 'font';
        }
        if ($settings->layout_id !== $publishedSettings->layout_id) {
            $unpublished[] = 'layout';
        }
        if ($settings->loading_effect_id !== $publishedSettings->loading_effect_id) {
            $unpublished[] = 'layout';
        }

        return $unpublished;
    }

    /**
     * Publish changes
     */
    public function publishChanges()
    {
        $user = $this->user;
        DB::transaction(function () use ($user) {
            $unpublishedSettings = VisualSetting::findFromUser($this->user, false);
            if (!$unpublishedSettings) {
                return;
            }
            $publishedSettings = VisualSetting::findFromUser($this->user, true);
            $unpublishedSettings->published = true;
            $unpublishedSettings->save();
            $publishedSettings->delete();
        });
    }

    /**
     * Discard
     */
    public function discardChanges()
    {
        $unpublishedSettings = VisualSetting::findFromUser($this->user, false);
        if (!$unpublishedSettings) {
            return;
        }
        $unpublishedSettings->delete();
    }
}
