import React from 'react';
import { Link } from 'react-router-dom';
import FieldError from '@/components/FieldError';

type LegalConsentProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
};

const LegalConsent = ({ checked, onChange, error }: LegalConsentProps) => {
  return (
    <div className="space-y-1">
      <label className="flex items-start gap-2.5 text-xs text-gray-400 leading-relaxed cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 bg-black/40 accent-[#BD20D3]"
        />
        <span>
          Súhlasím so spracovaním osobných údajov podľa{' '}
          <Link to="/podmienky-pouzivania" className="text-[#BD20D3] hover:underline" target="_blank" rel="noreferrer">
            zásad ochrany súkromia
          </Link>{' '}
          a{' '}
          <Link to="/obchodne-podmienky" className="text-[#BD20D3] hover:underline" target="_blank" rel="noreferrer">
            obchodných podmienok
          </Link>
          .
        </span>
      </label>
      <FieldError message={error} />
    </div>
  );
};

export default LegalConsent;
