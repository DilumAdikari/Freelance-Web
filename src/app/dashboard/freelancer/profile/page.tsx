'use client';

import { useState } from 'react';
import Link from 'next/link';

interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

interface CertificateItem {
  id: string;
  title: string;
  issuedBy: string;
  year: string;
}

export default function FreelancerProfileSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // 1. Basic Info State
  const [name, setName] = useState('Dilum Adikari');
  const [headline, setHeadline] = useState('Full Stack Web Developer | Next.js & MERN Specialist');
  const [hourlyRate, setHourlyRate] = useState('35');
  const [github, setGithub] = useState('https://github.com');
  const [linkedin, setLinkedin] = useState('https://linkedin.com');

  // 2. Detailed Description State
  const [description, setDescription] = useState(
    'I am a passionate Full-Stack Software Developer with extensive experience in building modern, scalable web applications using Next.js, React, Node.js, Express, and MongoDB. I focus on clean architecture, optimal database designs, and responsive user experiences.'
  );

  // 3. Skills State
  const [skills, setSkills] = useState<string[]>([
    'Next.js',
    'React',
    'Node.js',
    'MongoDB',
    'TypeScript',
    'Tailwind CSS',
  ]);
  const [newSkill, setNewSkill] = useState('');

  // 4. Education State
  const [educationList, setEducationList] = useState<EducationItem[]>([
    {
      id: '1',
      degree: 'Bachelor of Information Technology (BIT)',
      institution: 'University of Moratuwa',
      year: '2026',
    },
  ]);
  const [newDegree, setNewDegree] = useState('');
  const [newInstitution, setNewInstitution] = useState('');
  const [newEduYear, setNewEduYear] = useState('');

  // 5. Certifications State
  const [certificates, setCertificates] = useState<CertificateItem[]>([
    {
      id: '1',
      title: 'Meta Full-Stack Professional Certificate',
      issuedBy: 'Coursera / Meta',
      year: '2025',
    },
  ]);
  const [newCertTitle, setNewCertTitle] = useState('');
  const [newCertIssuer, setNewCertIssuer] = useState('');
  const [newCertYear, setNewCertYear] = useState('');

  // Skills Handlers
  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  // Education Handlers
  const handleAddEducation = () => {
    if (!newDegree.trim() || !newInstitution.trim()) return;
    setEducationList([
      ...educationList,
      {
        id: Date.now().toString(),
        degree: newDegree.trim(),
        institution: newInstitution.trim(),
        year: newEduYear.trim() || 'Present',
      },
    ]);
    setNewDegree('');
    setNewInstitution('');
    setNewEduYear('');
  };

  const handleRemoveEducation = (id: string) => {
    setEducationList(educationList.filter((item) => item.id !== id));
  };

  // Certificate Handlers
  const handleAddCertificate = () => {
    if (!newCertTitle.trim() || !newCertIssuer.trim()) return;
    setCertificates([
      ...certificates,
      {
        id: Date.now().toString(),
        title: newCertTitle.trim(),
        issuedBy: newCertIssuer.trim(),
        year: newCertYear.trim() || '2026',
      },
    ]);
    setNewCertTitle('');
    setNewCertIssuer('');
    setNewCertYear('');
  };

  const handleRemoveCertificate = (id: string) => {
    setCertificates(certificates.filter((item) => item.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(null);

    // Backend update action එක සම්බන්ධ වූ පසු මෙතැනට data pass කළ හැක
    setTimeout(() => {
      setLoading(false);
      setSuccessMsg('Your profile, education, and certificates have been updated successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
    }, 800);
  };

  return (
    <div className="space-y-6 text-black antialiased">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-black sm:text-3xl">
            Profile Settings
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Showcase your professional background, credentials, and achievements to buyers.
          </p>
        </div>

        <Link
          href="/freelancers/me"
          target="_blank"
          className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-black shadow-sm transition hover:border-black"
        >
          <span>View Public Profile</span>
          <span className="text-gray-400">↗</span>
        </Link>
      </div>

      {successMsg && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800">
          ✓ {successMsg}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* SECTION 1: BASIC & PROFESSIONAL HEADLINE */}
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-base font-bold text-black border-b border-gray-100 pb-4">
            Basic Information
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1.5 block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-black transition focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">
                Hourly Rate ($ USD)
              </label>
              <div className="relative mt-1.5">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 font-bold text-gray-400">
                  $
                </span>
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  min="5"
                  className="block w-full rounded-xl border border-gray-300 bg-white py-3 pl-8 pr-4 text-sm text-black transition focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">
                Professional Headline
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Full Stack Developer | Next.js Specialist"
                required
                className="mt-1.5 block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-black transition focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: DETAILED DESCRIPTION */}
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-base font-bold text-black border-b border-gray-100 pb-4">
            Professional Description
          </h2>
          <p className="mt-2 text-xs text-gray-400">
            Tell clients about your work style, core expertise, project experience, and what sets you apart.
          </p>

          <div className="mt-4">
            <textarea
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your background, technical skills, previous projects, and how you communicate with clients..."
              required
              className="block w-full rounded-xl border border-gray-300 bg-white p-4 text-sm text-black transition focus:border-black focus:outline-none focus:ring-1 focus:ring-black leading-relaxed"
            />
          </div>
        </div>

        {/* SECTION 3: EDUCATION */}
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-black">Education</h2>
              <p className="text-xs text-gray-400">Add your college, university, or academic qualifications.</p>
            </div>
          </div>

          {/* Education List */}
          <div className="mt-4 space-y-3">
            {educationList.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50/60 p-4 transition hover:bg-gray-50"
              >
                <div>
                  <h4 className="text-sm font-bold text-black">{item.degree}</h4>
                  <p className="text-xs text-gray-500">
                    {item.institution} • <span className="font-medium text-black">{item.year}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveEducation(item.id)}
                  className="rounded-lg p-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          {/* Add New Education Inputs */}
          <div className="mt-5 rounded-2xl border border-dashed border-gray-300 bg-gray-50/40 p-4">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-3">
              + Add Education Qualification
            </span>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <input
                type="text"
                value={newDegree}
                onChange={(e) => setNewDegree(e.target.value)}
                placeholder="Degree (e.g. B.Sc in Computer Science)"
                className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-black focus:border-black focus:outline-none"
              />
              <input
                type="text"
                value={newInstitution}
                onChange={(e) => setNewInstitution(e.target.value)}
                placeholder="College / University"
                className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-black focus:border-black focus:outline-none"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newEduYear}
                  onChange={(e) => setNewEduYear(e.target.value)}
                  placeholder="Year (e.g. 2026)"
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-black focus:border-black focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="rounded-xl bg-black px-4 py-2 text-xs font-semibold text-white transition hover:bg-gray-800"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: CERTIFICATIONS */}
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-black">Certifications & Awards</h2>
              <p className="text-xs text-gray-400">List verified professional certifications or courses you completed.</p>
            </div>
          </div>

          {/* Certificate List */}
          <div className="mt-4 space-y-3">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50/60 p-4 transition hover:bg-gray-50"
              >
                <div>
                  <h4 className="text-sm font-bold text-black">{cert.title}</h4>
                  <p className="text-xs text-gray-500">
                    Issued by <strong className="font-semibold text-gray-700">{cert.issuedBy}</strong> • {cert.year}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveCertificate(cert.id)}
                  className="rounded-lg p-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          {/* Add Certificate Inputs */}
          <div className="mt-5 rounded-2xl border border-dashed border-gray-300 bg-gray-50/40 p-4">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-3">
              + Add Certificate or License
            </span>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <input
                type="text"
                value={newCertTitle}
                onChange={(e) => setNewCertTitle(e.target.value)}
                placeholder="Certificate Name (e.g. AWS Certified Developer)"
                className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-black focus:border-black focus:outline-none"
              />
              <input
                type="text"
                value={newCertIssuer}
                onChange={(e) => setNewCertIssuer(e.target.value)}
                placeholder="Issuer (e.g. Amazon Web Services / Google)"
                className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-black focus:border-black focus:outline-none"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCertYear}
                  onChange={(e) => setNewCertYear(e.target.value)}
                  placeholder="Year (e.g. 2026)"
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-black focus:border-black focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddCertificate}
                  className="rounded-xl bg-black px-4 py-2 text-xs font-semibold text-white transition hover:bg-gray-800"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 5: SKILLS & TAGS */}
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-base font-bold text-black border-b border-gray-100 pb-4">
            Skills & Expertise
          </h2>
          <p className="mt-2 text-xs text-gray-400">
            Add relevant technology and skill tags.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-800"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="h-4 w-4 rounded-full text-gray-400 hover:text-black hover:bg-gray-200 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="mt-4 flex max-w-sm gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={handleAddSkill}
              placeholder="e.g. Docker, GraphQL"
              className="block w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs text-black placeholder:text-gray-400 focus:border-black focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-black hover:border-black transition"
            >
              Add
            </button>
          </div>
        </div>

        {/* SECTION 6: SOCIAL / LINKS */}
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-base font-bold text-black border-b border-gray-100 pb-4">
            Social & Portfolio Links
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">
                GitHub Profile
              </label>
              <input
                type="url"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/username"
                className="mt-1.5 block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-black transition focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">
                LinkedIn Profile
              </label>
              <input
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="mt-1.5 block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-black transition focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center rounded-xl bg-black px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Saving Changes...
              </span>
            ) : (
              'Save Profile Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}