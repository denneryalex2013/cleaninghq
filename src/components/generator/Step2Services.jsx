import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Briefcase } from "lucide-react";

const services = [
  { value: "Commercial Cleaning", icon: "🏢" },
  { value: "Residential Cleaning", icon: "🏠" },
  { value: "Post-Construction Cleaning", icon: "🏗️" },
  { value: "Office Cleaning", icon: "💼" },
  { value: "Medical Cleaning", icon: "🏥" },
  { value: "Janitorial Services", icon: "🧹" },
  { value: "Airbnb Cleaning", icon: "🏡" },
  { value: "Move-In / Move-Out Cleaning", icon: "📦" },
  { value: "Floor Care", icon: "🧽" },
  { value: "Carpet Cleaning", icon: "🪟" },
  { value: "Pressure Washing", icon: "💧" },
  { value: "Window Cleaning", icon: "🪟" }
];

export default function Step2Services({ formData, setFormData, onNext, onBack }) {
  const selectedServices = formData.service_types || [];

  const toggleService = (service) => {
    const newServices = selectedServices.includes(service)
      ? selectedServices.filter(s => s !== service)
      : [...selectedServices, service];
    setFormData({ ...formData, service_types: newServices });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedServices.length === 0) {
      alert('Please select at least one service');
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Briefcase className="w-8 h-8 text-teal-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">What services do you offer?</h2>
        <p className="text-gray-600">Select all that apply</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => {
          const isSelected = selectedServices.includes(service.value);
          return (
            <button
              key={service.value}
              type="button"
              onClick={() => toggleService(service.value)}
              className={`p-5 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? 'border-teal-600 bg-teal-50'
                  : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{service.icon}</span>
                  <span className="font-semibold text-gray-900">{service.value}</span>
                </div>
                {isSelected ? (
                  <CheckCircle2 className="w-6 h-6 text-teal-600" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-300" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="w-full h-12 text-base font-semibold"
        >
          Back
        </Button>
        <Button
          type="submit"
          className="w-full h-12 text-base font-semibold bg-teal-600 hover:bg-teal-700"
        >
          Continue
        </Button>
      </div>
    </form>
  );
}