// components/ProgressSteps.tsx
'use client';

import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { Title } from './Typography';

interface ProgressStepsProps {
  steps: string[];
  currentStep: number;
  activeColor?: string;
  inactiveColor?: string;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({
  steps,
  currentStep,
  activeColor = 'text-custom-green-300',
  inactiveColor = 'text-custom-gray-50',
}) => {
  return (
    <div className="py-4">
      {/* Step numbers */}
      <div className="flex justify-between px-2 mb-1">
        {steps.map((_, index) => (
          <Title
            key={`number-${index}`}
            className={index <= currentStep ? activeColor : inactiveColor}
          >
            {index + 1}
          </Title>
        ))}
      </div>

      {/* Steps row */}
      <div className="flex items-center">
        {steps.map((step, index) => (
          <React.Fragment key={`step-${index}`}>
            {/* Circle icon */}
            <div className="z-10">
              {index <= currentStep ? (
                <FaCheckCircle
                  className={`w-6 h-6 ${activeColor}`}
                />
              ) : (
                <div className={`w-6 h-6 rounded-full border-2 ${inactiveColor}`} />
              )}
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-2 ${
                  index < currentStep ? activeColor : inactiveColor
                } bg-current`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressSteps;