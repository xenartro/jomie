<?php

namespace App\Services;

use Exception;

class Metadata
{
    public function getURLMetadata(string $url)
    {
        try {
            $tags = get_meta_tags($url);
        } catch (Exception $e) {
            return [];
        }

        return $this->processMetadataTags($tags);
    }

    private function processMetadataTags(array $tags)
    {
        $descriptionTags = ['og:description', 'description', 'twitter:description'];
        $imageTags = ['twitter:image:src', 'og:image'];
        $metaDescription = '';
        $metaImage = '';

        foreach ($tags as $name => $value) {
            if (!$metaDescription) {
                foreach ($descriptionTags as $descriptionTagName) {
                    if (strcasecmp($name, $descriptionTagName) === 0) {
                        $metaDescription = $value;
                    }
                }
            }
            if (!$metaImage) {
                foreach ($imageTags as $imageTagName) {
                    if (strcasecmp($name, $imageTagName) === 0) {
                        $metaImage = $value;
                    }
                }
            }
        }

        return [
            'description' => $metaDescription,
            'image'       => $metaImage,
        ];
    }
}
