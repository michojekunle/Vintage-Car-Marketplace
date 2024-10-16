import React from "react";
import { Card } from "@/components/ui/card"; // Assuming you have a Card component
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Assuming you have an Avatar component

const testimonialsData = [
  {
    id: 1,
    name: "Donald Nwokoro",
    title: "Satisfied Customer",
    feedback: "The service was excellent! I got my car repaired quickly and at a fair price.",
    avatarUrl: "/images/avatar1.jpg", // Example URL for the avatar image
  },
  {
    id: 2,
    name: "Yusuf Roqib",
    title: "Happy Client",
    feedback: "I appreciate the professionalism and expertise of the mechanics. Highly recommend!",
    avatarUrl: "/images/avatar2.jpg", // Example URL for the avatar image
  },
  {
    id: 3,
    name: "Roheemarh",
    title: "Returning Customer",
    feedback: "Great service! They fixed my car issues promptly and were very friendly.",
    avatarUrl: "/images/avatar3.jpg", // Example URL for the avatar image
  },
];

const Testimonials = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {testimonialsData.map((testimonial) => (
        <Card key={testimonial.id} className="shadow-lg p-4">
          <div className="flex items-center mb-4">
            <Avatar className="h-16 w-16 rounded-full mr-4" >
            <AvatarImage src={testimonial.avatarUrl} alt={testimonial.name} />
            <AvatarFallback>VC</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{testimonial.name}</h3>
              <p className="text-sm text-gray-500">{testimonial.title}</p>
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{testimonial.feedback}</p>
        </Card>
      ))}
    </div>
  );
};

export default Testimonials;
