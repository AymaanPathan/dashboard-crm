import { Star } from "lucide-react";
import React from "react";
interface TestimonialsProps {
  testimonials: any[];
}

export const TestimonialsSection: React.FC<TestimonialsProps> = ({
  testimonials,
}) => {
  return (
    <section id="testimonials" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Trusted by growing businesses
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            See what our customers are saying
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-6"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                {testimonial.content}
              </p>
              <div>
                <div className="font-semibold text-gray-900">
                  {testimonial.name}
                </div>
                <div className="text-sm text-gray-600">
                  {testimonial.role}, {testimonial.company}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
