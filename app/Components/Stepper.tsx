type StepperProps = {
  currentStep: number;
};

const steps = ["Select Service", "Enter User Details", "Check and Pay", "Confirmation"];

export default function Stepper({ currentStep }: StepperProps) {
  return (
    <div className="flex items-center justify-between max-w-5xl mx-auto mb-8">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isDone = stepNumber < currentStep;

        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1.5 shadow-sm">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold text-white ${
                  isActive || isDone ? "bg-indigo-900" : "bg-gray-400"
                }`}
              >
                {stepNumber}
              </span>
              <span
                className={`text-sm whitespace-nowrap ${
                  isActive ? "text-indigo-900 font-medium" : "text-gray-600"
                }`}
              >
                {label}
              </span>
            </div>
            {stepNumber !== steps.length && (
              <div className="h-px flex-1 bg-gray-300 mx-2" aria-hidden />
            )}
          </div>
        );
      })}
    </div>
  );
}