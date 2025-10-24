import React from "react";

type FeatureCardProps = {
  icon: string;
  title: string;
  description: React.ReactNode;
};

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="bg-(--color-text)/10 py-10 px-5 rounded-2xl shadow-md hover:backdrop-brightness-200">
      <i className={`${icon} text-(--color-primary) text-4xl mb-4`}></i>
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};

export default FeatureCard;
