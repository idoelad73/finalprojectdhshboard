// src/components/users/Users.jsx
import TableWrapper from '../../pages/dashboard/Tablewrapper'

export default function Users({ users, loading, error }) {
  return (
    <TableWrapper loading={loading} error={error}>
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-slate-200">
            <th className="text-left py-3 px-3 sm:px-6 text-sm font-bold text-slate-700 uppercase tracking-wider">Name</th>
            <th className="text-left py-3 px-3 sm:px-6 text-sm font-bold text-slate-700 uppercase tracking-wider">Email</th>
            <th className="text-left py-3 px-3 sm:px-6 text-sm font-bold text-slate-700 uppercase tracking-wider">Role</th>
            <th className="text-left py-3 px-3 sm:px-6 text-sm font-bold text-slate-700 uppercase tracking-wider">Joined</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users.map(u => (
            <tr key={u._id} className="hover:bg-slate-50 transition-colors">
              <td className="py-3 px-3 sm:px-6 text-slate-900 font-medium">{u.user_name}</td>
              <td className="py-3 px-3 sm:px-6 text-slate-600">{u.user_email}</td>
              <td className="py-3 px-3 sm:px-6">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${u.user_role === 'admin'
                  ? 'bg-purple-100 text-purple-700 ring-1 ring-purple-200'
                  : 'bg-blue-100 text-blue-700 ring-1 ring-blue-200'}`}>
                  {u.user_role}
                </span>
              </td>
              <td className="py-3 px-3 sm:px-6 text-slate-600">{new Date(u.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrapper>
  );
}
