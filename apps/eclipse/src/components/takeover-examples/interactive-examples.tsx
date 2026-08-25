"use client";

import { useState } from "react";
import {
  Takeover,
  TakeoverMenu,
  TakeoverHeader,
  TakeoverTitle,
  TakeoverDescription,
  TakeoverContent,
  TakeoverFooter,
  Button,
} from "@prisma/eclipse";

export function TakeoverMenuExample() {
  const [isOpen, setIsOpen] = useState(true);
  const [step, setStep] = useState(1);

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleReset = () => {
    setIsOpen(true);
    setStep(1);
  };

  if (!isOpen) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-foreground-neutral-weak">
          Takeover closed. Click below to reopen.
        </p>
        <Button onClick={handleReset}>Reopen Takeover</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Takeover className="border">
        <TakeoverMenu onBack={handleBack} onClose={handleClose} />
        <TakeoverHeader>
          <TakeoverTitle>Step {step} of 3</TakeoverTitle>
          <TakeoverDescription>
            {step === 1 && "Welcome! This is the first step of the process."}
            {step === 2 && "Great! You're on the second step now."}
            {step === 3 && "Final step! Almost done."}
          </TakeoverDescription>
        </TakeoverHeader>
        <TakeoverContent>
          {step < 3 ? (
            <Button onClick={() => setStep(step + 1)}>Next Step</Button>
          ) : (
            <Button onClick={handleReset}>Complete & Reset</Button>
          )}
        </TakeoverContent>
      </Takeover>
    </div>
  );
}

export function WizardTakeoverExample() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
  };

  return (
    <div className="space-y-4">
      <Takeover className="border bg-background-neutral">
        <TakeoverMenu variant="wizard">
          <div className="flex w-full items-center justify-between gap-4">
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              variant="default-weak"
            >
              <i className="fa-regular fa-arrow-left" />
              Previous
            </Button>
            <span className="text-sm font-medium">
              Step {currentStep} of {totalSteps}
            </span>
            <Button
              onClick={currentStep === totalSteps ? handleReset : handleNext}
              variant="default"
            >
              {currentStep === totalSteps ? "Finish" : "Next"}
              {currentStep !== totalSteps && (
                <i className="fa-regular fa-arrow-right" />
              )}
            </Button>
          </div>
        </TakeoverMenu>
        <TakeoverHeader>
          <TakeoverTitle>
            {currentStep === 1 && "Getting Started"}
            {currentStep === 2 && "Configuration"}
            {currentStep === 3 && "Team Setup"}
            {currentStep === 4 && "All Set!"}
          </TakeoverTitle>
          <TakeoverDescription>
            {currentStep === 1 && "Let's begin by setting up your account."}
            {currentStep === 2 && "Configure your preferences and settings."}
            {currentStep === 3 && "Invite your team members to collaborate."}
            {currentStep === 4 && "You're ready to start using the platform!"}
          </TakeoverDescription>
        </TakeoverHeader>
        <TakeoverContent>
          <div className="text-sm text-foreground-neutral-weak">
            Progress: {Math.round((currentStep / totalSteps) * 100)}%
          </div>
        </TakeoverContent>
      </Takeover>
    </div>
  );
}

export function SimpleTakeoverMenuExample() {
  const [showMenu, setShowMenu] = useState(true);

  return (
    <div className="space-y-4">
      <Takeover className="border">
        {showMenu && (
          <TakeoverMenu
            onBack={() => alert("Back clicked!")}
            onClose={() => setShowMenu(false)}
          />
        )}
        {!showMenu && (
          <div className="flex items-center gap-2">
            <p className="text-sm text-foreground-neutral-weak">Menu hidden.</p>
            <Button variant="default-weak" onClick={() => setShowMenu(true)}>
              Show Menu
            </Button>
          </div>
        )}
        <TakeoverHeader>
          <TakeoverTitle>Interactive Takeover</TakeoverTitle>
          <TakeoverDescription>
            This takeover has navigation controls. Try clicking the back or
            close buttons in the menu above.
          </TakeoverDescription>
        </TakeoverHeader>
        <TakeoverContent>
          <Button>Take Action</Button>
        </TakeoverContent>
      </Takeover>
    </div>
  );
}

export function TakeoverWithFooterAndHeaderExample() {
  return (
    <div className="space-y-2">
      <Takeover className="border">
        <TakeoverMenu onBack={() => {}} onClose={() => {}} />
        <TakeoverHeader>
          <TakeoverTitle>Complete Layout</TakeoverTitle>
          <TakeoverDescription>
            This shows a full takeover with header, content, and footer.
          </TakeoverDescription>
        </TakeoverHeader>
        <TakeoverContent>
          <Button>Primary Action</Button>
        </TakeoverContent>
        <TakeoverFooter>
          <p className="text-sm text-foreground-neutral-weak text-center">
            Additional information or secondary actions
          </p>
        </TakeoverFooter>
      </Takeover>
    </div>
  );
}

export function TakeoverWithFooterOnlyExample() {
  return (
    <div className="space-y-2">
      <Takeover className="border">
        <TakeoverMenu onBack={() => {}} onClose={() => {}} />
        <TakeoverContent>
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold">Quick Action</h3>
            <p className="text-sm text-foreground-neutral-weak">
              Perform an action without additional header information.
            </p>
            <Button>Confirm Action</Button>
          </div>
        </TakeoverContent>
        <TakeoverFooter>
          <div className="flex justify-between items-center">
            <Button variant="default-weak">Cancel</Button>
            <Button variant="default">Save</Button>
          </div>
        </TakeoverFooter>
      </Takeover>
    </div>
  );
}

export function TakeoverWithHeaderOnlyExample() {
  return (
    <div className="space-y-2">
      <Takeover className="border">
        <TakeoverMenu onBack={() => {}} onClose={() => {}} />
        <TakeoverHeader>
          <TakeoverTitle>Header Only Layout</TakeoverTitle>
          <TakeoverDescription>
            This layout includes a header and content, but no footer.
          </TakeoverDescription>
        </TakeoverHeader>
        <TakeoverContent>
          <div className="flex gap-2">
            <Button>Primary</Button>
            <Button variant="default-weak">Secondary</Button>
          </div>
        </TakeoverContent>
      </Takeover>
    </div>
  );
}

export function WizardWithFooterExample() {
  const [step, setStep] = useState(1);

  return (
    <div className="space-y-2">
      <Takeover className="border bg-background-neutral">
        <TakeoverMenu variant="wizard">
          <div className="flex w-full justify-between items-center">
            <span className="text-sm font-medium">Step {step} of 3</span>
          </div>
        </TakeoverMenu>
        <TakeoverHeader>
          <TakeoverTitle>Wizard Step {step}</TakeoverTitle>
          <TakeoverDescription>
            Complete this step to continue the process.
          </TakeoverDescription>
        </TakeoverHeader>
        <TakeoverContent>
          <div className="text-sm text-foreground-neutral-weak">
            Step content goes here...
          </div>
        </TakeoverContent>
        <TakeoverFooter>
          <div className="flex justify-between items-center">
            <Button
              variant="default-weak"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
            >
              <i className="fa-regular fa-arrow-left mr-2" />
              Previous
            </Button>
            <Button
              onClick={() => setStep(Math.min(3, step + 1))}
              disabled={step === 3}
            >
              Next
              <i className="fa-regular fa-arrow-right ml-2" />
            </Button>
          </div>
        </TakeoverFooter>
      </Takeover>
    </div>
  );
}
