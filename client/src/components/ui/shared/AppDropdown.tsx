import React, { useState, type ReactNode } from "react";

interface AppDropdownProps {
  label: ReactNode;
  children: ReactNode;
}

interface DropdownOverlayProps {
  onClick: () => void;
}

const DropdownOverlay: React.FC<DropdownOverlayProps> = (props) => {
  return (
    <div
      className="w-screen h-screen fixed top-0 left-0 transition-all z-80
      bg-transparent"
      onClick={props.onClick}
    />
  );
};

export const AppDropdown: React.FC<AppDropdownProps> = (props) => {
  const [showContent, setContent] = useState(false);

  //   const showContentHandler = () => setContent(() => true);
  const showContentHandler = () => {
    if (showContent) {
      setContent(() => false);
      return;
    }
    setContent(() => true);
  };

  const hideContentHandler = () => setContent(() => false);

  return (
    <div className="relative z-10">
      <label onClick={() => showContentHandler()}>{props.label}</label>
      {showContent && (
        <div>
          <div
            className="z-100 absolute top-3 right-3 bg-green-500s bg-gray-50
             border-1 border-gray-300 rounded-md p-2 transition-all"
          >
            {props.children}
          </div>
          <DropdownOverlay onClick={hideContentHandler} />
        </div>
      )}
    </div>
  );
};
