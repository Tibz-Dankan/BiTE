import React, { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { categoryCertificateAPI } from "../../../api/categoryCertificate";
import { Modal } from "../shared/Modal";
import { Button } from "../shared/Btn";
import { FileImage, FileText, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { CertificateLightTheme } from "./CertificateLightTheme";

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
    queryKey: ["cert-claim-status-download", certID, userID],
    queryFn: () =>
      categoryCertificateAPI.getClaimStatus({ id: certID, userID }),
    enabled: !!certID && !!userID,
  });

  const claimData = data?.data;
  const categoryName = claimData?.certificate?.quizCategory?.name ?? "Category";
  const recipientName =
    claimData?.certificateAwarded?.user?.name ?? "Recipient";
  const certQuizzes = claimData?.certificate?.categoryCertificateQuizzes ?? [];
  const quizProgresses = claimData?.quizProgresses ?? [];

  const totalQuestionsCompleted = quizProgresses.reduce(
    (sum: number, qp: any) => sum + (qp.totalQuestions || 0),
    0,
  );

  const quizzes = certQuizzes.map((cq: any, index: number) => ({
    number: index + 1,
    title: (cq.quiz?.title || "").replace(/\n/g, "").trim(),
    score: "Completed",
  }));

  const handleDownloadPNG = async () => {
    if (!certRef.current) return;
    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#0a0a0f",
        logging: false,
        allowTaint: true,
        scrollX: 0,
        scrollY: -window.scrollY,
      });
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${recipientName.replace(/\s+/g, "_")}_${Math.floor(Date.now() / 1000)}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, "image/png");
    } catch (err) {
      console.error("PNG download failed:", err);
    }
  };

  const handleDownloadPDF = async () => {
    if (!certRef.current) return;
    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#0a0a0f",
        logging: false,
        allowTaint: true,
        scrollX: 0,
        scrollY: -window.scrollY,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      const pdfBlob = pdf.output("blob");
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${recipientName.replace(/\s+/g, "_")}_${Math.floor(Date.now() / 1000)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF download failed:", err);
    }
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
            <CertificateLightTheme
              recipientName={recipientName}
              categoryName={categoryName}
              quizzes={quizzes}
              questionsCompleted={totalQuestionsCompleted}
              exams={`${quizzes.length} BiTEs`}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};
