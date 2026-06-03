/**
 * EmployeeList
 * =============
 * White background, #DDDDDD borders, orange #111111 accent.
 */

import { useSignature, type SavedEmployee } from '@kit/email-signature/contexts/SignatureContext';
import { Edit2, Trash2, UserCircle2 } from 'lucide-react';
import { useState } from 'react';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function ConfirmDelete({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4 border border-[#e5e7eb]">
        <h3 className="font-semibold text-[#1a1a1a] mb-2">Delete Signature</h3>
        <p className="text-sm text-[#666666] mb-5">
          Are you sure you want to delete the signature for <strong>{name}</strong>? This cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded border border-[#e5e7eb] text-[#555555] hover:bg-[#f9f9f9] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export function EmployeeList() {
  const { employees, loadEmployee, deleteEmployee, activeEmployeeId } = useSignature();
  const [deleteTarget, setDeleteTarget] = useState<SavedEmployee | null>(null);

  return (
    <div className="border-t border-[#e5e7eb] bg-white">
      {/* Section header */}
      <div className="px-5 py-3 flex items-center gap-2">
        <UserCircle2 size={14} style={{ color: '#111111' }} />
        <span className="field-section-label">
          Team Signatures ({employees.length})
        </span>
      </div>

      {/* Employee rows */}
      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {employees.length === 0 ? (
          <div className="px-5 py-4 text-[#aaaaaa] text-[12px] font-mono">
            No signatures saved yet. Fill in the fields and click Save.
          </div>
        ) : (
          employees.map((emp) => (
            <div
              key={emp.id}
              className={`employee-row flex items-center gap-3 px-5 py-2.5 ${emp.id === activeEmployeeId ? 'active' : ''}`}
            >
              {/* Avatar */}
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[11px] font-semibold uppercase bg-[#f3f4f6] text-[#374151]">
                {emp.employeeName.charAt(0)}
              </div>

              {/* Name + date */}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-[#1a1a1a] truncate leading-tight">
                  {emp.employeeName}
                </p>
                <p className="text-[10px] text-[#aaaaaa] font-mono mt-0.5">
                  {emp.fields.jobTitle} · Saved {formatDate(emp.updatedAt)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => loadEmployee(emp)}
                  title="Load and edit"
                  className="p-1.5 rounded text-[#bbbbbb] hover:text-[#111111] hover:bg-[#f3f4f6] transition-colors"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  onClick={() => setDeleteTarget(emp)}
                  title="Delete"
                  className="p-1.5 rounded text-[#bbbbbb] hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {deleteTarget && (
        <ConfirmDelete
          name={deleteTarget.employeeName}
          onConfirm={() => {
            deleteEmployee(deleteTarget.id);
            setDeleteTarget(null);
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
