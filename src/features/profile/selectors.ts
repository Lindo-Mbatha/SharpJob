export function deriveProfileStrength(input: {
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  applicantHeadline: string;
  applicantLocation: string;
  applicantAbout: string;
  applicantPortfolio: string;
  applicantLinkedIn: string;
  profileSkills: string[];
}): {
  profileMissingCount: number;
  profileStrengthLabel: string;
} {
  const checks = [
    input.applicantName.trim().length > 0,
    input.applicantEmail.trim().length > 0,
    input.applicantPhone.trim().length > 0,
    input.applicantHeadline.trim().length > 0,
    input.applicantLocation.trim().length > 0,
    input.applicantAbout.trim().length > 0,
    input.applicantPortfolio.trim().length > 0,
    input.applicantLinkedIn.trim().length > 0,
    input.profileSkills.length > 0
  ];

  const completed = checks.filter(Boolean).length;
  const missing = checks.length - completed;
  const strength = Math.round((completed / checks.length) * 100);

  return {
    profileMissingCount: missing,
    profileStrengthLabel: `${strength}%`
  };
}
