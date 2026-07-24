import { useState } from "react";
import { Job } from "../../listings/types";
import { captureRecoverableError } from "../monitoring/telemetry";

export function useApplyFlow({
  selectedJob,
  setJobs,
  triggerNotification,
  applicantName
}: {
  selectedJob: Job | null;
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  triggerNotification: (message: string) => void;
  applicantName: string;
}) {
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const [applyStep, setApplyStep] = useState<number>(1);
  const [uploadedResume, setUploadedResume] = useState<string | null>("Alex_Mercer_CV_2026.pdf");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [coverLetterText, setCoverLetterText] = useState<string>("");
  const [isSubmittingApp, setIsSubmittingApp] = useState<boolean>(false);
  const [confettiActive, setConfettiActive] = useState<boolean>(false);

  const generateMockCoverLetter = (job: Job) => {
    const text = `Dear Hiring Team at ${job.company},

I am incredibly excited to submit my application for the ${job.title} role at your company. Having followed ${job.company}'s journey in the industry, I am consistently inspired by your mission and products.

As a designer and developer with extensive experience building intuitive web and mobile solutions, I possess the technical skills and user-centric approach required to make an immediate impact on your team. I thrive on collaborating across functions to build solutions that scale beautifully.

Thank you so much for your time and consideration. I look forward to hopefully presenting my portfolio and discussing how my background aligns with your vision.

Sincerely,
${applicantName}`;
    setCoverLetterText(text);
  };

  const handleMockUpload = () => {
    setIsUploading(true);
    setUploadProgress(10);
    const interval = window.setInterval(() => {
      try {
        setUploadProgress(prev => {
          if (prev >= 100) {
            window.clearInterval(interval);
            setIsUploading(false);
            setUploadedResume("Alex_CV_SharpJob_Tailored.pdf");
            return 100;
          }
          return prev + 30;
        });
      } catch (error) {
        window.clearInterval(interval);
        setIsUploading(false);
        captureRecoverableError(
          error,
          triggerNotification,
          "apply_flow_upload",
          "Resume upload failed. Please try again."
        );
      }
    }, 300);
  };

  const handleRemoveResumeFromWizard = () => {
    setUploadedResume(null);
    triggerNotification("Removed resume from application drawer.");
  };

  const handleFinalSubmitApp = () => {
    if (!selectedJob) return;
    setIsSubmittingApp(true);

    window.setTimeout(() => {
      try {
        setIsSubmittingApp(false);
        setJobs(prevJobs =>
          prevJobs.map(job => {
            if (job.id === selectedJob.id) {
              return {
                ...job,
                isApplied: true,
                appliedStatus: "Submitted",
                appliedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
              };
            }
            return job;
          })
        );

        setConfettiActive(true);
        setApplyStep(4);
        triggerNotification(`Application submitted! stripe has received your resume for ${selectedJob.title}.`);

        window.setTimeout(() => {
          setConfettiActive(false);
        }, 5000);
      } catch (error) {
        setIsSubmittingApp(false);
        captureRecoverableError(
          error,
          triggerNotification,
          "apply_flow_submit",
          "Application submit failed. Please retry."
        );
      }
    }, 1500);
  };

  return {
    state: {
      isApplying,
      applyStep,
      uploadedResume,
      isUploading,
      uploadProgress,
      coverLetterText,
      isSubmittingApp,
      confettiActive
    },
    actions: {
      setIsApplying,
      setApplyStep,
      setUploadedResume,
      setCoverLetterText,
      generateMockCoverLetter,
      handleMockUpload,
      handleRemoveResumeFromWizard,
      handleFinalSubmitApp
    }
  };
}
