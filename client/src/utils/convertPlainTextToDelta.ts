import Quill from "quill";

export const convertPlainTextToDelta = (plainText: string) => {
  const tempContainer = document.createElement("div");
  const tempQuill = new Quill(tempContainer);

  tempQuill.setText(plainText);

  const delta = tempQuill.getContents();

  tempContainer.remove();

  return delta;
};
