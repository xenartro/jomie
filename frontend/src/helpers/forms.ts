import { ChangeEvent, Dispatch, FormEvent, SetStateAction } from "react";
import { s } from "services/preview";

export type DataType = Record<string, string | number>;
export type SetDataType =
  | Dispatch<SetStateAction<DataType>>
  | ((arg0: DataType) => void);

export const handleInputChange = (
  data: DataType,
  setData: SetDataType,
  e: ChangeEvent<HTMLInputElement>
) => {
  setData({
    ...data,
    [e.target.name]: s(e.target.value),
  });
};

export const handleArrayInputChange = (
  data: string[],
  index: number,
  setData: (data: string[]) => void,
  e: ChangeEvent<HTMLInputElement>
) => {
  const newData = [...data];
  newData[index] = s(e.target.value);
  setData(newData);
};

export const handleTextAreaChange = (
  data: DataType,
  setData: SetDataType,
  e: FormEvent<HTMLTextAreaElement>
) => {
  setData({
    ...data,
    [e.currentTarget.name]: s(e.currentTarget.value),
  });
};

export const handleCheckboxChange = (
  data: DataType,
  setData: SetDataType,
  e: FormEvent<HTMLInputElement>
) => {
  setData({
    ...data,
    [e.currentTarget.name]: e.currentTarget.checked ? 1 : 0,
  });
};
