
import React from 'react';
import { MapPin, Clock, DollarSign, ArrowRight, ExternalLink } from 'lucide-react';
import { Job } from '../types';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const handleApply = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      // Pre-fill message if possible (optional logic)
      const messageArea = document.querySelector('textarea');
      if (messageArea) {
        messageArea.value = `I am interested in applying for the ${job.title} position at ${job.company}.`;
      }
    }
  };

  return (
    <div 
      onClick={handleApply}
      className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <ExternalLink className="w-4 h-4 text-blue-400" />
      </div>
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {job.title}
          </h3>
          <p className="text-blue-600 font-medium">{job.company}</p>
        </div>
        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">
          {job.type}
        </span>
      </div>

      <div className="space-y-2 mb-6">
        <div className="flex items-center text-gray-500 text-sm">
          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
          {job.location}
        </div>
        <div className="flex items-center text-gray-500 text-sm">
          <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
          {job.salary}
        </div>
        <div className="flex items-center text-gray-500 text-sm">
          <Clock className="w-4 h-4 mr-2 text-gray-400" />
          Posted {job.postedAt}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">{job.category}</span>
        <button className="inline-flex items-center text-blue-600 font-bold text-sm group-hover:translate-x-1 transition-transform">
          Apply Now <ArrowRight className="ml-1 w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default JobCard;
