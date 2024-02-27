import { StepIndicator, StepIndicatorStep } from "@trussworks/react-uswds";

export default function IncomeVerificationStepIndicator() {
  return (
    <StepIndicator headingLevel="h2" className="margin-bottom-6">
      <StepIndicatorStep label="Claim information" status="complete" />
      <StepIndicatorStep label="Verify identity" status="complete" />
      <StepIndicatorStep label="Verify income" status="current" />
    </StepIndicator>
  );
}
