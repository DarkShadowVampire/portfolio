import React from "react";

const certifications = [
  {
    name: "Guidewire Certified Associate - Jutro Developer - Qusar",
    date: "03 Aug 2026",
  },
  {
    name: "Guidewire Certified Specialist - EnterpriseEngage Configuration - Mammoth",
    date: "02 Apr 2025",
  },
  {
    name: "Guidewire Certified Specialist - EnterpriseEngage Integration - Las Lenas",
    date: "04 Dec 2024",
  },
  {
    name: "Guidewire Certified Specialist - InsuranceSuite Integration - Las Lenas",
    date: "04 Dec 2024",
  },
];

const Certifications: React.FC = () => {
  return (
    <section id="certifications" className="certifications">
      <h4>Certifications</h4>
      <div className="certifications__list">
        {certifications.map((certification) => (
          <div key={certification.name} className="certification__item">
            <div className="certification__badge">Guidewire</div>
            <h5>{certification.name}</h5>
            <p>{certification.date}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Certifications;
