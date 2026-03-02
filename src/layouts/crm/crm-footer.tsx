'use client';

import React from 'react';

const CrmFooter: React.FC = () => {
  return (
    <footer className="h-12 flex flex-col md:flex-row items-center justify-end gap-2 px-4 md:px-8 bg-white border-t border-gray-100 text-[#A3AED0] text-sm">
      <div className="flex items-center gap-6 font-medium">
        <span>© 2026 SENSORX. All rights reserved.</span>
      </div>
    </footer>
  );
};

export default CrmFooter;