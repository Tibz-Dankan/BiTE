import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { categoryCertificateAPI } from "../../../api/categoryCertificate";
import { Modal } from "../shared/Modal";
import { Button } from "../shared/Btn";
import { Download, Loader2 } from "lucide-react";

interface UserCategoryCertificateDownloadV2Props {
  certID: string;
  userID: string;
  isOpen: boolean;
  onClose: () => void;
}

export const UserCategoryCertificateDownloadV2: React.FC<
  UserCategoryCertificateDownloadV2Props
> = ({ certID, userID, isOpen, onClose }) => {
  const [pngCooldown, setPngCooldown] = useState(false);
  const [pdfCooldown, setPdfCooldown] = useState(false);
  const { data, isPending } = useQuery({
    queryKey: ["cert-claim-status-download", certID, userID],
    queryFn: () =>
      categoryCertificateAPI.getClaimStatus({ id: certID, userID }),
    enabled: !!certID && !!userID,
  });

  const claimData = data?.data;
  const awardedAttachments = claimData?.certificateAwarded?.attachments ?? [];

  const pngAttachment = awardedAttachments.find(
    (a: any) => a.type === "CERTIFICATE_PNG",
  );
  const pdfAttachment = awardedAttachments.find(
    (a: any) => a.type === "CERTIFICATE_PDF",
  );

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url, {
        mode: "cors",
        credentials: "omit",
      });
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div
        className="w-[95vw] md:w-[80vw] lg:w-[900px] min-h-[50vh] max-h-[90vh] bg-gray-50
            rounded-md p-6 flex flex-col gap-4 overflow-y-auto"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-gray-800 font-semibold text-xl">
            Your Certificate
          </h2>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              className={`flex items-center gap-2 px-3 py-2 h-auto text-sm
               bg-(--primary) text-white rounded-lg ${pngCooldown ? "opacity-50 cursor-not-allowed" : "hover:bg-(--primary)/90"}`}
              onClick={async () => {
                if (pngAttachment && !pngCooldown) {
                  setPngCooldown(true);
                  await handleDownload(
                    pngAttachment.url,
                    pngAttachment.filename,
                  );
                  setTimeout(() => setPngCooldown(false), 5000);
                }
              }}
              disabled={isPending || !pngAttachment || pngCooldown}
            >
              <Download className="w-4 h-4" />
              PNG
            </Button>
            <Button
              type="button"
              className={`flex items-center gap-2 px-3 py-2 h-auto text-sm
               bg-(--primary) text-white rounded-lg ${pdfCooldown ? "opacity-50 cursor-not-allowed" : "hover:bg-(--primary)/90"}`}
              onClick={async () => {
                if (pdfAttachment && !pdfCooldown) {
                  setPdfCooldown(true);
                  await handleDownload(
                    pdfAttachment.url,
                    pdfAttachment.filename,
                  );
                  setTimeout(() => setPdfCooldown(false), 5000);
                }
              }}
              disabled={isPending || !pdfAttachment || pdfCooldown}
            >
              <Download className="w-4 h-4" />
              PDF
            </Button>
          </div>
        </div>

        {isPending ? (
          <div className="w-full min-h-[300px] flex items-center justify-center">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-gray-800" />
              <span className="text-gray-800 text-sm">
                Loading certificate...
              </span>
            </div>
          </div>
        ) : pngAttachment ? (
          <div className="w-full flex items-center justify-center">
            <img
              src={pngAttachment.url}
              alt="Certificate Preview"
              className="w-full h-auto rounded-md"
            />
          </div>
        ) : (
          <div className="w-full min-h-[300px] flex items-center justify-center">
            <span className="text-gray-500 text-sm">
              Certificate preview is not available.
            </span>
          </div>
        )}
      </div>
    </Modal>
  );
};
