/* =====================================================
   CYBERCRASH — Demo Authentication
   Frontend-only mock authentication
   ===================================================== */

const DEMO_USERS = {
  'lea_demo':   { portal: 'portals/lea.html',   label: 'LEA Investigation Portal' },
  'bank_demo':  { portal: 'portals/bank.html',  label: 'Bank Intelligence Portal' },
  'i4c_demo':   { portal: 'portals/i4c.html',   label: 'I4C Cyber Intelligence Portal' },
  'admin_demo': { portal: 'portals/admin.html', label: 'Administration Portal' },
};

/**
 * Simulate an async login check.
 * In production replace this with a real API call.
 */
export async function loginAsync(userId, password) {
  // Simulate network latency
  await new Promise(r => setTimeout(r, 700 + Math.random() * 400));

  const user = DEMO_USERS[userId.toLowerCase()];

  if (!user) {
    return {
      success: false,
      error: `Unrecognised credentials. Valid demo IDs: lea_demo · bank_demo · i4c_demo · admin_demo`,
    };
  }

  if (!password || password.length === 0) {
    return {
      success: false,
      error: 'Password is required.',
    };
  }

  return {
    success: true,
    portal: user.portal,
    label: user.label,
  };
}
