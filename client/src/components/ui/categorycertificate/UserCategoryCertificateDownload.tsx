import React, { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { categoryCertificateAPI } from "../../../api/categoryCertificate";
import { Modal } from "../shared/Modal";
import { Button } from "../shared/Btn";
import {
  // Download,
  FileImage,
  FileText,
  Loader2,
} from "lucide-react";
import Certificate from "./Certificate";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

interface UserCategoryCertificateDownloadProps {
  certID: string;
  userID: string;
  isOpen: boolean;
  onClose: () => void;
}

export const UserCategoryCertificateDownload: React.FC<
  UserCategoryCertificateDownloadProps
> = ({ certID, userID, isOpen, onClose }) => {
  const certRef = useRef<HTMLDivElement>(null);

  const { data, isPending } = useQuery({
    queryKey: ["cert-award-by-user", certID, userID],
    queryFn: () => categoryCertificateAPI.getAwardByUser({ certID, userID }),
    enabled: !!certID && !!userID,
  });

  const award = data?.data;
  const categoryName =
    award?.categoryCertificate?.quizCategory?.name ?? "Category";
  const recipientName = award?.user?.name ?? "Recipient";
  const quizzes = award?.categoryCertificate?.quizCategory?.quizzes ?? [];

  const modules = quizzes.map((q: any, index: number) => ({
    number: index + 1,
    title: (q.title || "").replace(/\n/g, "").trim(),
    score: "Completed",
  }));

  const handleDownloadPNG = async () => {
    if (!certRef.current) return;
    const canvas = await html2canvas(certRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#0a0a0f",
    });
    const link = document.createElement("a");
    link.download = `${categoryName}_Certificate.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleDownloadPDF = async () => {
    if (!certRef.current) return;
    const canvas = await html2canvas(certRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#0a0a0f",
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`${categoryName}_Certificate.pdf`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div
        className="w-[95vw] md:w-[80vw] lg:w-[900px] max-h-[90vh] bg-gray-50
            rounded-md p-6 flex flex-col gap-4 overflow-y-auto"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-gray-800 font-semibold text-xl">
            Your Certificate
          </h2>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              className="flex items-center gap-2 px-3 py-2 h-auto text-sm
               bg-(--primary) text-white rounded-lg hover:bg-(--primary)/90"
              onClick={handleDownloadPNG}
              disabled={isPending}
            >
              <FileImage className="w-4 h-4" />
              PNG
            </Button>
            <Button
              type="button"
              className="flex items-center gap-2 px-3 py-2 h-auto text-sm
               bg-(--primary) text-white rounded-lg hover:bg-(--primary)/90"
              onClick={handleDownloadPDF}
              disabled={isPending}
            >
              <FileText className="w-4 h-4" />
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
        ) : (
          <div ref={certRef}>
            <Certificate
              recipientName={recipientName}
              categoryName={categoryName}
              modules={modules}
              questionsCompleted={modules.length}
              exams={`${modules.length} BiTEs`}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};
