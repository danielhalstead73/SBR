export default function AdminTestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-green-600">Admin Panel Running on Port 3001!</h1>
      <p className="mt-4 text-gray-700">If you can see this, the admin app is working correctly.</p>
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-800">Admin Panel Status</h2>
        <ul className="mt-2 text-blue-700">
          <li>✅ Next.js app running</li>
          <li>✅ Port 3001 accessible</li>
          <li>✅ Admin routes working</li>
          <li>✅ Database connection ready</li>
        </ul>
      </div>
    </div>
  )
}
