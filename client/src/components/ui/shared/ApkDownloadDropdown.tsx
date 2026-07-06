import React from "react";
import { ChevronDown, Download } from "lucide-react";
import { SCNButton } from "./button";
import { AndroidIcon } from "./AndroidIcon";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "./dropdown-menu";
import { APK_DOWNLOAD_URL } from "../../../constants/urls";

const installSteps = [
  <>
    Tap <span className="font-medium text-gray-800">Download APK</span> below.
  </>,
  <>
    Open the downloaded{" "}
    <span className="font-medium text-gray-800">bitcoinhighschool.apk</span>{" "}
    file.
  </>,
  <>
    If prompted, allow installs from this source ("Install unknown apps").
  </>,
  <>
    Tap <span className="font-medium text-gray-800">Install</span>, then{" "}
    <span className="font-medium text-gray-800">Open</span>.
  </>,
];

export const ApkDownloadDropdown: React.FC = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SCNButton
          variant="outline"
          size="sm"
          aria-label="Download the Android app"
          className="gap-1 px-2 text-gray-700"
        >
          <AndroidIcon className="w-4 h-4" />
          <ChevronDown className="w-4 h-4 opacity-70" />
        </SCNButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 p-3 space-y-3 bg-white">
        <div className="space-y-1">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <AndroidIcon className="w-4 h-4 text-(--primary)" />
            Download the Android app
          </h3>
          <p className="text-xs text-gray-500">
            Official BitcoinHighSchool app. Not distributed through the Google
            Play Store.
          </p>
        </div>

        <ol className="list-decimal space-y-1.5 pl-4 text-xs text-gray-600">
          {installSteps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>

        <SCNButton
          asChild
          className="w-full bg-(--primary) text-(--primary-foreground)"
        >
          <a
            href={APK_DOWNLOAD_URL}
            download
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download className="w-4 h-4" />
            Download APK
          </a>
        </SCNButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
