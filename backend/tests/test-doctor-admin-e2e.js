const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('--- STARTING DOCTOR & ADMIN END-TO-END VERIFICATION ---');

  try {
    // 1. Authenticate as Doctor
    console.log('\n[1] Testing Doctor Login...');
    const docLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'dr_sharma@ruralhealth.org',
        password: 'Password@123'
      })
    });
    const docLogin = await docLoginRes.json();
    if (!docLogin.success) throw new Error(docLogin.message);
    const docToken = docLogin.data.token;
    console.log('✓ Doctor login successful. Token received.');

    const docHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${docToken}`
    };

    // 2. Doctor Dashboard
    console.log('\n[2] Testing GET /api/doctors/dashboard...');
    const docDashRes = await fetch(`${BASE_URL}/doctors/dashboard`, { headers: docHeaders });
    const docDash = await docDashRes.json();
    if (!docDash.success) throw new Error(docDash.message);
    console.log('✓ Doctor dashboard retrieved:', docDash.data.stats);

    // 3. Doctor Connected Patients
    console.log('\n[3] Testing GET /api/doctors/my/patients...');
    const docPatientsRes = await fetch(`${BASE_URL}/doctors/my/patients`, { headers: docHeaders });
    const docPatients = await docPatientsRes.json();
    if (!docPatients.success) throw new Error(docPatients.message);
    console.log(`✓ Connected patients retrieved: ${docPatients.data.length} found.`);

    // 4. Authenticate as Admin
    console.log('\n[4] Testing Admin Login...');
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@gramacare.org',
        password: 'Admin@12345'
      })
    });
    const adminLogin = await adminLoginRes.json();
    if (!adminLogin.success) throw new Error(adminLogin.message);
    const adminToken = adminLogin.data.token;
    console.log('✓ Admin login successful. Token received.');

    const adminHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    };

    // 5. Admin Stats
    console.log('\n[5] Testing GET /api/admin/stats...');
    const adminStatsRes = await fetch(`${BASE_URL}/admin/stats`, { headers: adminHeaders });
    const adminStats = await adminStatsRes.json();
    if (!adminStats.success) throw new Error(adminStats.message);
    console.log('✓ Admin platform metrics retrieved:', adminStats.data.counts);

    // 6. Admin Users List
    console.log('\n[6] Testing GET /api/admin/users...');
    const adminUsersRes = await fetch(`${BASE_URL}/admin/users`, { headers: adminHeaders });
    const adminUsers = await adminUsersRes.json();
    if (!adminUsers.success) throw new Error(adminUsers.message);
    console.log(`✓ Admin users list retrieved: ${adminUsers.data.length} users registered.`);

    // 7. Admin Doctor Applications
    console.log('\n[7] Testing GET /api/admin/doctors...');
    const adminDocsRes = await fetch(`${BASE_URL}/admin/doctors`, { headers: adminHeaders });
    const adminDocs = await adminDocsRes.json();
    if (!adminDocs.success) throw new Error(adminDocs.message);
    console.log(`✓ Admin doctor applications retrieved: ${adminDocs.data.length} applications.`);

    // 8. Admin Global Appointments
    console.log('\n[8] Testing GET /api/admin/appointments...');
    const adminApptsRes = await fetch(`${BASE_URL}/admin/appointments`, { headers: adminHeaders });
    const adminAppts = await adminApptsRes.json();
    if (!adminAppts.success) throw new Error(adminAppts.message);
    console.log(`✓ Admin appointments log retrieved: ${adminAppts.data.length} appointments.`);

    console.log('\n======================================================');
    console.log('✓ ALL DOCTOR & ADMIN APIS AND DATABASE INTEGRATIONS PASSED WITH 0 ERRORS!');
    console.log('======================================================');
  } catch (err) {
    console.error('Test failed:', err.message);
    process.exit(1);
  }
}

runTests();
