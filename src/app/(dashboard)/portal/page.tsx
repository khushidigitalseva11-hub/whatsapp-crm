'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  Mail,
  MapPin,
  Clock,
  Truck,
  ArrowRight,
} from 'lucide-react';
import { INITIAL_SERVICES, BUSINESS_INFO, BRAND_GUIDELINES } from '@/lib/digitalSeva';
import { DigitalService } from '@/types/digitalSeva';

export default function CitizenPortalPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedService, setSelectedService] = useState<DigitalService | null>(null);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  // Form Fields
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantAddress, setApplicantAddress] = useState('');

  const categories = [
    'All',
    'PAN Card',
    'Government Scheme',
    'Healthcare',
    'Agriculture',
    'Elections',
    'Smart Cards',
    'Certificates',
  ];

  const filteredServices = INITIAL_SERVICES.filter((srv) => {
    const matchesSearch =
      srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.name_gu.includes(searchQuery) ||
      srv.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || srv.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setApplicationSubmitted(true);
    setTimeout(() => {
      setSelectedService(null);
      setApplicationSubmitted(false);
      setApplicantName('');
      setApplicantEmail('');
      setApplicantAddress('');
    }, 3000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner (Strict Email-Only Compliance) */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-blue-950 via-slate-900 to-slate-950 p-6 shadow-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-amber-500 px-2 py-0.5 text-[10px] font-black text-slate-950">
                અધિકૃત સહાય કેન્દ્ર
              </span>
              <span className="text-xs text-slate-400 font-mono">સાધલી, વડોદરા</span>
            </div>
            <h1 className="mt-2 text-2xl font-black text-white">
              {BUSINESS_INFO.name_gu}
            </h1>
            <p className="text-xs text-slate-300">
              {BUSINESS_INFO.name} • {BUSINESS_INFO.tagline_gu}
            </p>
          </div>

          {/* Business Meta (Strictly Email Only - No Phone or WhatsApp) */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-emerald-300">
              <Mail className="h-4 w-4" />
              <span>સંપર્ક: {BRAND_GUIDELINES.public_email}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-slate-300">
              <Truck className="h-4 w-4 text-amber-400" />
              <span>PVC સ્માર્ટ કાર્ડ હોમ ડિલિવરી</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center Details Bar */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <MapPin className="h-5 w-5 text-amber-400 shrink-0" />
          <div className="text-xs">
            <div className="font-bold text-white">કેન્દ્રનું સરનામું</div>
            <div className="text-slate-400">રુદ્ર કોમ્પ્લેક્સ, ટિંબરવા રોડ, સાધલી, જિ. વડોદરા</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <Clock className="h-5 w-5 text-blue-400 shrink-0" />
          <div className="text-xs">
            <div className="font-bold text-white">કામકાજનો સમય</div>
            <div className="text-slate-400">{BUSINESS_INFO.workingHours}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
          <div className="text-xs">
            <div className="font-bold text-white">સરકારી પોર્ટલ સહાય</div>
            <div className="text-slate-400">100% કાયદેસર અને અધિકૃત અરજી સહાય</div>
          </div>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="સેવા શોધો (PAN, આયુષ્માન, PM કિસાન, PVC...)"
            className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-primary text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid (21 Services) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-5 hover:border-primary/50 transition-all shadow-md group"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                  {service.category}
                </span>
                <span className="text-base font-black text-amber-400">
                  ₹{service.price}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-white text-base group-hover:text-primary transition-colors">
                  {service.name_gu}
                </h3>
                <p className="text-xs text-slate-400">{service.name}</p>
              </div>

              <p className="text-xs text-slate-300 line-clamp-2">
                {service.description}
              </p>

              {service.required_documents && (
                <div className="pt-1">
                  <span className="text-[10px] font-semibold text-slate-400 block mb-1">જરૂરી દસ્તાવેજ:</span>
                  <div className="flex flex-wrap gap-1">
                    {service.required_documents.map((doc) => (
                      <span
                        key={doc.id}
                        className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded"
                      >
                        {doc.doc_name_gu}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">કોડ: {service.service_code}</span>
              <button
                onClick={() => setSelectedService(service)}
                className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-white hover:bg-primary/90 transition shadow-sm"
              >
                અરજી કરો (Apply)
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Application Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-lg">
                  {selectedService.name_gu} ({selectedService.name})
                </h3>
                <p className="text-xs text-amber-400 font-semibold">
                  નિયત ફી: ₹{selectedService.price} • સાધલી સેવા કેન્દ્ર
                </p>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="rounded-lg p-1 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {applicationSubmitted ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
                <h4 className="text-base font-bold text-white">અરજી સફળતાપૂર્વક નોંધાઈ ગઈ છે!</h4>
                <p className="text-xs text-slate-300">
                  અમારા પ્રતિનિધિ ટૂંક સમયમાં તમારા ઈમેલ પર પુષ્ટિ મોકલશે.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">અરજદારનું પૂરું નામ</label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="આધાર કાર્ડ મુજબ નામ"
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300">સંપર્ક ઈમેલ (Email)</label>
                  <input
                    type="email"
                    required
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    placeholder="તમારો ઈમેલ એડ્રેસ"
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300">સરનામું / ગામ</label>
                  <input
                    type="text"
                    required
                    value={applicantAddress}
                    onChange={(e) => setApplicantAddress(e.target.value)}
                    placeholder="ગામ / શહેર, તાલુકો, જિલ્લો"
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 text-[11px] text-slate-400">
                  ⚠️ <strong className="text-slate-300">નોંધ:</strong> અરજી સબમિટ કર્યા બાદ દસ્તાવેજ ચકાસણી કરવામાં આવશે. જાહેર સંપર્ક માટે ઈમેલ: <span className="text-amber-400">{BRAND_GUIDELINES.public_email}</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedService(null)}
                    className="flex-1 rounded-xl bg-slate-800 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-700"
                  >
                    રદ કરો
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-primary py-2.5 text-xs font-bold text-white hover:bg-primary/90"
                  >
                    અરજી સબમિટ કરો
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
