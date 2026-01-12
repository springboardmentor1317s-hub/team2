import { useState, FormEvent } from "react";

type Role = "student" | "admin";

interface CompleteProfileModalProps {
  isOpen: boolean;
  onSubmit: (data: { role: Role; university: string }) => Promise<void>;
}

const CompleteProfileModal = ({
  isOpen,
  onSubmit,
}: CompleteProfileModalProps) => {
  const [role, setRole] = useState<Role>("student");
  const [university, setUniversity] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit({ role, university });
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div
        className="w-full max-w-md rounded-xl p-6 shadow-xl"
        style={{ backgroundColor: "#121B2F" }}
      >
        <h2 className="mb-1 text-xl font-semibold text-white">
          Complete Your Profile
        </h2>
        <p className="mb-5 text-sm text-gray-400">
          Please provide the following details to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full rounded-lg border border-gray-600 bg-[#0E1628] px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            >
              <option value="student" className="bg-[#0E1628] text-white">
                Student
              </option>
              <option value="admin" className="bg-[#0E1628] text-white">
                Admin
              </option>
            </select>
          </div>

          {/* University */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">
              University / Campus
            </label>
            <input
              type="text"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              placeholder="Enter your university or campus"
              className="w-full rounded-lg border border-gray-600 bg-[#0E1628] px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Complete Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfileModal;
