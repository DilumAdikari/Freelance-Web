'use client';

import { useState, useEffect, useRef, ChangeEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getFreelancerProfile, updateFreelancerProfile } from '@/actions/profile';
import { IEducation, ICertificate } from '@/models/FreelancerProfile';

export default function FreelancerProfileSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Profile Data States
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState<string>('');
  const [headline, setHeadline] = useState('');
  const [hourlyRate, setHourlyRate] = useState<number>(20);
  const [location] = useState('Sri Lanka');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [educationList, setEducationList] = useState<IEducation[]>([]);
  const [certificates, setCertificates] = useState<ICertificate[]>([]);

  // Hidden File Input Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal State
  const [activeModal, setActiveModal] = useState<
    'basic' | 'description' | 'skills' | 'education' | 'certificates' | 'social' | null
  >(null);

  // Temporary Edit Form States
  const [tempName, setTempName] = useState('');
  const [tempHeadline, setTempHeadline] = useState('');
  const [tempHourlyRate, setTempHourlyRate] = useState<number>(20);
  const [tempDescription, setTempDescription] = useState('');
  const [tempSkills, setTempSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [tempGithub, setTempGithub] = useState('');
  const [tempLinkedin, setTempLinkedin] = useState('');

  // Education/Cert inputs
  const [newDegree, setNewDegree] = useState('');
  const [newInstitution, setNewInstitution] = useState('');
  const [newEduYear, setNewEduYear] = useState('');

  const [newCertTitle, setNewCertTitle] = useState('');
  const [newCertIssuer, setNewCertIssuer] = useState('');
  const [newCertYear, setNewCertYear] = useState('');

  // 1. Initial Load: Fetch from MongoDB
  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      setErrorMsg(null);
      const res = await getFreelancerProfile();

      if (res.success && res.user && res.profile) {
        setName(res.user.name || '');
        setAvatar(res.user.avatar || res.profile.avatar || '');
        setHeadline(res.profile.headline || '');
        setHourlyRate(res.profile.hourlyRate ?? 20);
        setDescription(res.profile.description || '');
        setSkills(res.profile.skills || []);
        setEducationList(res.profile.education || []);
        setCertificates(res.profile.certificates || []);
        setGithub(res.profile.github || '');
        setLinkedin(res.profile.linkedin || '');
      } else if (!res.success) {
        setErrorMsg(res.error || 'Failed to load profile');
      }
      setLoading(false);
    }

    loadProfile();
  }, []);

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  // 2. High-Speed Image Resize, Compression & Instant Database Save
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImg(true);
    setErrorMsg(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;

      img.onload = async () => {
        // Dimensions 300x300 ge compress maaduvudu
        const maxDimension = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);

          // 70% quality jote sanna size (50KB-80KB) file create maaduvudu
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);

          setAvatar(compressedBase64);
          setUploadingImg(false);

          // Database ge instant save
          const res = await updateFreelancerProfile({ avatar: compressedBase64 });
          if (res.success) {
            showNotification('Profile photo updated successfully!');
          } else {
            setErrorMsg('Failed to save profile picture');
          }
        }
      };
    };

    reader.readAsDataURL(file);
  };

  // 3. Generic Database Save Action
  const persistUpdate = async (
    overrides: {
      name?: string;
      headline?: string;
      hourlyRate?: number;
      description?: string;
      skills?: string[];
      education?: IEducation[];
      certificates?: ICertificate[];
      github?: string;
      linkedin?: string;
      avatar?: string;
    },
    successText: string
  ) => {
    setSaving(true);
    setErrorMsg(null);

    const payload = {
      name,
      avatar,
      headline,
      hourlyRate,
      description,
      skills,
      education: educationList,
      certificates,
      github,
      linkedin,
      ...overrides,
    };

    const res = await updateFreelancerProfile(payload);
    setSaving(false);

    if (res.success) {
      setActiveModal(null);
      showNotification(successText);
    } else {
      setErrorMsg(res.error || 'Failed to save changes to database');
    }
  };

  // Save Handlers
  const handleSaveBasic = () => {
    setName(tempName);
    setHeadline(tempHeadline);
    setHourlyRate(tempHourlyRate);
    persistUpdate(
      { name: tempName, headline: tempHeadline, hourlyRate: tempHourlyRate },
      'Basic information saved successfully!'
    );
  };

  const handleSaveDescription = () => {
    setDescription(tempDescription);
    persistUpdate({ description: tempDescription }, 'Professional overview saved successfully!');
  };

  const handleSaveSkills = () => {
    setSkills(tempSkills);
    persistUpdate({ skills: tempSkills }, 'Skills updated successfully!');
  };

  const handleSaveSocial = () => {
    setGithub(tempGithub);
    setLinkedin(tempLinkedin);
    persistUpdate({ github: tempGithub, linkedin: tempLinkedin }, 'Social profile links saved successfully!');
  };

  const handleAddEducation = () => {
    if (!newDegree.trim() || !newInstitution.trim()) return;
    const updated: IEducation[] = [
      ...educationList,
      {
        id: Date.now().toString(),
        degree: newDegree.trim(),
        institution: newInstitution.trim(),
        year: newEduYear.trim() || 'Present',
      },
    ];
    setEducationList(updated);
    setNewDegree('');
    setNewInstitution('');
    setNewEduYear('');
    persistUpdate({ education: updated }, 'Education qualification added successfully!');
  };

  const handleRemoveEducation = (id: string) => {
    const updated = educationList.filter((item) => item.id !== id);
    setEducationList(updated);
    persistUpdate({ education: updated }, 'Education qualification removed successfully!');
  };

  const handleAddCertificate = () => {
    if (!newCertTitle.trim() || !newCertIssuer.trim()) return;
    const updated: ICertificate[] = [
      ...certificates,
      {
        id: Date.now().toString(),
        title: newCertTitle.trim(),
        issuedBy: newCertIssuer.trim(),
        year: newCertYear.trim() || '2026',
      },
    ];
    setCertificates(updated);
    setNewCertTitle('');
    setNewCertIssuer('');
    setNewCertYear('');
    persistUpdate({ certificates: updated }, 'Certification added successfully!');
  };

  const handleRemoveCertificate = (id: string) => {
    const updated = certificates.filter((item) => item.id !== id);
    setCertificates(updated);
    persistUpdate({ certificates: updated }, 'Certification removed successfully!');
  };

  if (loading) {
    return (
      <div className="flex h-72 flex-col items-center justify-center gap-3 text-sm font-semibold text-gray-500">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-black border-t-transparent" />
        <p>Loading your profile details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-black antialiased">
      {/* File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />

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

      {errorMsg && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-600 animate-in fade-in duration-200">
          {errorMsg}
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

            {/* Profile Avatar Container */}
            <div className="relative mx-auto h-28 w-28">
              <div className="relative h-28 w-28 overflow-hidden rounded-full bg-black shadow-md ring-4 ring-gray-100 flex items-center justify-center">
                {uploadingImg ? (
                  <span className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : avatar ? (
                  <Image
                    src={avatar}
                    alt={name || 'Profile Photo'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-3xl font-black text-white">
                    {name ? name.charAt(0).toUpperCase() : 'U'}
                  </span>
                )}
              </div>

              {/* Camera Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImg}
                className="absolute bottom-0 right-0 rounded-full bg-white p-2.5 shadow-md border border-gray-200 hover:bg-gray-50 hover:scale-105 active:scale-95 transition cursor-pointer"
                title="Upload Profile Photo"
              >
                <span className="text-sm leading-none">📷</span>
              </button>
            </div>

            <h2 className="mt-4 text-xl font-black text-black">{name || 'Your Name'}</h2>
            <p className="mt-1 text-xs text-gray-500 line-clamp-2">
              {headline || 'Set your professional headline'}
            </p>

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
              {skills.length === 0 ? (
                <p className="text-xs text-gray-400">No skills added yet.</p>
              ) : (
                skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-xl bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-800"
                  >
                    {skill}
                  </span>
                ))
              )}
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
                <span className="font-medium text-black truncate max-w-[150px]">
                  {github ? github.replace('https://', '') : 'Not connected'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">LinkedIn:</span>
                <span className="font-medium text-black truncate max-w-[150px]">
                  {linkedin ? linkedin.replace('https://', '') : 'Not connected'}
                </span>
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
              {description || 'Provide an overview of your experience, services, and workflows.'}
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
                      onClick={() => handleRemoveEducation(item.id)}
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
                      onClick={() => handleRemoveCertificate(cert.id)}
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

      {/* ================= MODALS ================= */}

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
                  onChange={(e) => setTempHourlyRate(Number(e.target.value))}
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
                disabled={saving}
                className="rounded-xl bg-black px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-gray-800 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
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
                disabled={saving}
                className="rounded-xl bg-black px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-gray-800 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
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
                disabled={saving}
                className="rounded-xl bg-black px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-gray-800 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
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
                onClick={handleAddEducation}
                disabled={saving}
                className="rounded-xl bg-black px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-gray-800 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Add'}
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
                onClick={handleAddCertificate}
                disabled={saving}
                className="rounded-xl bg-black px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-gray-800 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Add'}
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
                disabled={saving}
                className="rounded-xl bg-black px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-gray-800 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}