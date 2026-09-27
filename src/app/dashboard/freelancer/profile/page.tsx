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
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Profile Data States
  const [name, setName] = useState('Dilum Adikari');
  const [headline, setHeadline] = useState('Full Stack Web Developer | Next.js & MERN Specialist');
  const [hourlyRate, setHourlyRate] = useState('35');
  const [location] = useState('Sri Lanka');
  const [github, setGithub] = useState('https://github.com');
  const [linkedin, setLinkedin] = useState('https://linkedin.com');

  const [description, setDescription] = useState(
    'I am a passionate Full-Stack Software Developer with extensive experience in building modern, scalable web applications using Next.js, React, Node.js, Express, and MongoDB. I focus on clean architecture, optimal database designs, and responsive user experiences.'
  );

  const [skills, setSkills] = useState<string[]>([
    'Next.js',
    'React',
    'Node.js',
    'MongoDB',
    'TypeScript',
    'Tailwind CSS',
  ]);

  const [educationList, setEducationList] = useState<EducationItem[]>([
    {
      id: '1',
      degree: 'Bachelor of Information Technology (BIT)',
      institution: 'University of Moratuwa',
      year: '2026',
    },
  ]);

  const [certificates, setCertificates] = useState<CertificateItem[]>([
    {
      id: '1',
      title: 'Meta Full-Stack Professional Certificate',
      issuedBy: 'Coursera / Meta',
      year: '2025',
    },
  ]);

  // Modal State
  const [activeModal, setActiveModal] = useState<
    'basic' | 'description' | 'skills' | 'education' | 'certificates' | 'social' | null
  >(null);

  // Temporary Edit Form States
  const [tempName, setTempName] = useState(name);
  const [tempHeadline, setTempHeadline] = useState(headline);
  const [tempHourlyRate, setTempHourlyRate] = useState(hourlyRate);
  const [tempDescription, setTempDescription] = useState(description);
  const [tempSkills, setTempSkills] = useState<string[]>(skills);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [tempGithub, setTempGithub] = useState(github);
  const [tempLinkedin, setTempLinkedin] = useState(linkedin);

  // Education/Cert inputs
  const [newDegree, setNewDegree] = useState('');
  const [newInstitution, setNewInstitution] = useState('');
  const [newEduYear, setNewEduYear] = useState('');

  const [newCertTitle, setNewCertTitle] = useState('');
  const [newCertIssuer, setNewCertIssuer] = useState('');
  const [newCertYear, setNewCertYear] = useState('');

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  // Save Actions
  const handleSaveBasic = () => {
    setName(tempName);
    setHeadline(tempHeadline);
    setHourlyRate(tempHourlyRate);
    setActiveModal(null);
    showNotification('Basic information updated successfully!');
  };

  const handleSaveDescription = () => {
    setDescription(tempDescription);
    setActiveModal(null);
    showNotification('Professional overview updated successfully!');
  };

  const handleSaveSkills = () => {
    setSkills(tempSkills);
    setActiveModal(null);
    showNotification('Skills updated successfully!');
  };

  const handleSaveSocial = () => {
    setGithub(tempGithub);
    setLinkedin(tempLinkedin);
    setActiveModal(null);
    showNotification('Social profile links updated successfully!');
  };

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
    showNotification('Education qualification added successfully!');
  };

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
    showNotification('Certification added successfully!');
  };

  return (
    <div className="space-y-6 text-black antialiased">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-black sm:text-3xl">
            Freelancer Profile
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Manage your public marketplace presence. Click the pen (✏️) icon on any section to edit details.
          </p>
        </div>

        <Link
          href="/freelancers/me"
          target="_blank"
          className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-black shadow-xs transition hover:border-black"
        >
          <span>View Public Profile</span>
          <span className="text-gray-400">↗</span>
        </Link>
      </div>

      {successMsg && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 animate-in fade-in duration-200">
          ✓ {successMsg}
        </div>
      )}

      {/* Main Grid: Left Sidebar & Right Content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* ================= LEFT SIDEBAR ================= */}
        <div className="space-y-6">
          {/* User Card */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs text-center relative">
            <button
              onClick={() => {
                setTempName(name);
                setTempHeadline(headline);
                setTempHourlyRate(hourlyRate);
                setActiveModal('basic');
              }}
              className="absolute top-5 right-5 text-gray-400 hover:text-black transition"
              title="Edit Basic Information"
            >
              ✏️
            </button>

            {/* Profile Avatar */}
            <div className="relative mx-auto h-28 w-28">
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-black text-3xl font-black text-white shadow-md ring-4 ring-gray-100">
                {name.charAt(0)}
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 rounded-full bg-white p-2 shadow-md border border-gray-200 hover:bg-gray-50 transition"
                title="Change Photo"
              >
                📷
              </button>
            </div>

            <h2 className="mt-4 text-xl font-black text-black">{name}</h2>
            <p className="mt-1 text-xs text-gray-500 line-clamp-2">{headline}</p>

            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Available for Work
            </div>

            <div className="mt-6 border-t border-gray-100 pt-4 text-left text-xs space-y-2.5 text-gray-600">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Country</span>
                <span className="font-semibold text-gray-900">{location} 🇱🇰</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Member Since</span>
                <span className="font-semibold text-gray-900">2026</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Hourly Rate</span>
                <span className="font-bold text-gray-900 text-sm">${hourlyRate}/hr</span>
              </div>
            </div>
          </div>

          {/* Skills Card */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600">
                Skills & Tech Stack
              </h3>
              <button
                onClick={() => {
                  setTempSkills([...skills]);
                  setActiveModal('skills');
                }}
                className="text-gray-400 hover:text-black transition"
                title="Edit Skills"
              >
                ✏️
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-xl bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Connected Profiles Card */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600">
                Connected Profiles
              </h3>
              <button
                onClick={() => {
                  setTempGithub(github);
                  setTempLinkedin(linkedin);
                  setActiveModal('social');
                }}
                className="text-gray-400 hover:text-black transition"
                title="Edit Social Profiles"
              >
                ✏️
              </button>
            </div>
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">GitHub:</span>
                <a
                  href={github}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-black hover:underline truncate max-w-[150px]"
                >
                  {github.replace('https://', '')}
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">LinkedIn:</span>
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-black hover:underline truncate max-w-[150px]"
                >
                  {linkedin.replace('https://', '')}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT MAIN CONTENT ================= */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio / Description Section */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600">
                Professional Overview & Bio
              </h3>
              <button
                onClick={() => {
                  setTempDescription(description);
                  setActiveModal('description');
                }}
                className="text-gray-400 hover:text-black transition"
                title="Edit Overview"
              >
                ✏️
              </button>
            </div>
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-gray-700">
              {description}
            </p>
          </div>

          {/* Education Section */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600">
                Education
              </h3>
              <button
                onClick={() => setActiveModal('education')}
                className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 hover:border-black transition"
              >
                + Add
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {educationList.length === 0 ? (
                <p className="text-xs text-gray-400">No education qualifications added yet.</p>
              ) : (
                educationList.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/70 p-4 transition hover:bg-gray-50"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-black">{item.degree}</h4>
                      <p className="text-xs text-gray-500">
                        {item.institution} • <span className="font-semibold text-black">{item.year}</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEducationList(educationList.filter((e) => e.id !== item.id))}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Certifications Section */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600">
                Certifications & Awards
              </h3>
              <button
                onClick={() => setActiveModal('certificates')}
                className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 hover:border-black transition"
              >
                + Add
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {certificates.length === 0 ? (
                <p className="text-xs text-gray-400">No certifications added yet.</p>
              ) : (
                certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/70 p-4 transition hover:bg-gray-50"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-black">{cert.title}</h4>
                      <p className="text-xs text-gray-500">
                        Issued by <strong className="font-semibold text-gray-800">{cert.issuedBy}</strong> • {cert.year}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCertificates(certificates.filter((c) => c.id !== cert.id))}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODALS (POPUP BOXES) ================= */}

      {/* 1. Basic Info Modal */}
      {activeModal === 'basic' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-xl">
            <h3 className="text-lg font-black text-black">Edit Basic Information</h3>
            <div className="mt-4 space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700">Display Name</label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-black focus:outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-gray-700">Hourly Rate ($ USD)</label>
                <input
                  type="number"
                  value={tempHourlyRate}
                  onChange={(e) => setTempHourlyRate(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-black focus:outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-gray-700">Professional Headline</label>
                <input
                  type="text"
                  value={tempHeadline}
                  onChange={(e) => setTempHeadline(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-black focus:outline-none"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setActiveModal(null)}
                className="rounded-xl border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBasic}
                className="rounded-xl bg-black px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-gray-800"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Description Modal */}
      {activeModal === 'description' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-xl">
            <h3 className="text-lg font-black text-black">Edit Overview & Bio</h3>
            <div className="mt-4">
              <textarea
                rows={6}
                value={tempDescription}
                onChange={(e) => setTempDescription(e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-4 text-sm leading-relaxed text-black focus:border-black focus:outline-none"
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setActiveModal(null)}
                className="rounded-xl border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDescription}
                className="rounded-xl bg-black px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-gray-800"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Skills Modal */}
      {activeModal === 'skills' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-xl">
            <h3 className="text-lg font-black text-black">Manage Skills</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {tempSkills.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 rounded-xl bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-800"
                >
                  {s}
                  <button
                    onClick={() => setTempSkills(tempSkills.filter((item) => item !== s))}
                    className="text-gray-400 hover:text-black font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                placeholder="New skill (e.g. Next.js)"
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-black focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  if (newSkillInput.trim() && !tempSkills.includes(newSkillInput.trim())) {
                    setTempSkills([...tempSkills, newSkillInput.trim()]);
                    setNewSkillInput('');
                  }
                }}
                className="rounded-xl bg-black px-4 py-2 text-xs font-semibold text-white"
              >
                Add
              </button>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setActiveModal(null)}
                className="rounded-xl border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSkills}
                className="rounded-xl bg-black px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-gray-800"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Add Education Modal */}
      {activeModal === 'education' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-xl">
            <h3 className="text-lg font-black text-black">Add Education</h3>
            <div className="mt-4 space-y-3">
              <input
                type="text"
                value={newDegree}
                onChange={(e) => setNewDegree(e.target.value)}
                placeholder="Degree (e.g. B.Sc in Software Engineering or BIT)"
                className="w-full rounded-xl border border-gray-300 p-2.5 text-xs focus:border-black focus:outline-none"
              />
              <input
                type="text"
                value={newInstitution}
                onChange={(e) => setNewInstitution(e.target.value)}
                placeholder="College / University"
                className="w-full rounded-xl border border-gray-300 p-2.5 text-xs focus:border-black focus:outline-none"
              />
              <input
                type="text"
                value={newEduYear}
                onChange={(e) => setNewEduYear(e.target.value)}
                placeholder="Graduation Year (e.g. 2026)"
                className="w-full rounded-xl border border-gray-300 p-2.5 text-xs focus:border-black focus:outline-none"
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setActiveModal(null)}
                className="rounded-xl border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleAddEducation();
                  setActiveModal(null);
                }}
                className="rounded-xl bg-black px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-gray-800"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Add Certificate Modal */}
      {activeModal === 'certificates' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-xl">
            <h3 className="text-lg font-black text-black">Add Certification</h3>
            <div className="mt-4 space-y-3">
              <input
                type="text"
                value={newCertTitle}
                onChange={(e) => setNewCertTitle(e.target.value)}
                placeholder="Certificate Title (e.g. AWS Certified Developer)"
                className="w-full rounded-xl border border-gray-300 p-2.5 text-xs focus:border-black focus:outline-none"
              />
              <input
                type="text"
                value={newCertIssuer}
                onChange={(e) => setNewCertIssuer(e.target.value)}
                placeholder="Issuing Organization (e.g. Meta / AWS / Google)"
                className="w-full rounded-xl border border-gray-300 p-2.5 text-xs focus:border-black focus:outline-none"
              />
              <input
                type="text"
                value={newCertYear}
                onChange={(e) => setNewCertYear(e.target.value)}
                placeholder="Year (e.g. 2025)"
                className="w-full rounded-xl border border-gray-300 p-2.5 text-xs focus:border-black focus:outline-none"
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setActiveModal(null)}
                className="rounded-xl border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleAddCertificate();
                  setActiveModal(null);
                }}
                className="rounded-xl bg-black px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-gray-800"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Social Links Modal */}
      {activeModal === 'social' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-xl">
            <h3 className="text-lg font-black text-black">Connected Profiles</h3>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-600">GitHub Profile URL</label>
                <input
                  type="url"
                  value={tempGithub}
                  onChange={(e) => setTempGithub(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-300 p-2.5 text-xs focus:border-black focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600">LinkedIn Profile URL</label>
                <input
                  type="url"
                  value={tempLinkedin}
                  onChange={(e) => setTempLinkedin(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-300 p-2.5 text-xs focus:border-black focus:outline-none"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setActiveModal(null)}
                className="rounded-xl border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSocial}
                className="rounded-xl bg-black px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-gray-800"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}