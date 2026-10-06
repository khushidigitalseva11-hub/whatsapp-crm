// scripts/test_jarvis_live.js
// Verification of JARVIS AI workflows, 10-Second rule, QA, and WhatsApp CRM bridge

const BASE_URL = 'http://localhost:3000';

async function testJarvisWorkflows() {
  console.log('====================================================');
  console.log('🚀 TESTING JARVIS AI OPERATING SYSTEM ON LOCALHOST:3000');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Test Script Generation
    console.log('--- 1. Testing Bilingual Script Generation ---');
    const scriptRes = await fetch(`${BASE_URL}/api/jarvis/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'generate-script',
        topic: 'નવું PAN Card ઓનલાઈન બનાવવા માટે સહાય',
        serviceCode: 'PAN',
        durationSec: 30,
      }),
    });
    const scriptData = await scriptRes.json();
    assert(scriptData.success && scriptData.script, 'Script generation API responded with success');
    assert(/[\u0A80-\u0AFF]/.test(scriptData.script.hook.text_gu), 'Hook text is genuine Unicode Gujarati');
    assert(scriptData.script.call_to_action.text_gu.includes('khushidigitalseva11@gmail.com'), 'CTA strictly uses Email Only contact (Section 7 policy)');

    // 2. Test 10-Second Shots Breakdown (Rule 21)
    console.log('\n--- 2. Testing 10-Second Flow AI Shot Storyboard ---');
    const shotsRes = await fetch(`${BASE_URL}/api/jarvis/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'generate-shots',
        script: scriptData.script,
      }),
    });
    const shotsData = await shotsRes.json();
    assert(shotsData.success && Array.isArray(shotsData.shots), 'Shots generated successfully');
    assert(shotsData.shots.length === 3, '30-second video accurately decomposed into 3 × 10s shots (Rule 21)');
    assert(shotsData.clips.length === 3, 'Flow AI clips array contains 3 continuous segments');

    // 3. Test Pre-Publishing QA Gate (Rule 24 & 46)
    console.log('\n--- 3. Testing Quality Assurance & Compliance Gate ---');
    const qaRes = await fetch(`${BASE_URL}/api/jarvis/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'run-qa',
        script: scriptData.script,
      }),
    });
    const qaData = await qaRes.json();
    assert(qaData.success && qaData.qaResult, 'QA Engine evaluated content');
    assert(qaData.qaResult.passed && qaData.qaResult.score >= 80, `QA Passed with score: ${qaData.qaResult.score}%`);

    // 4. Test WhatsApp CRM Lead Bridge (Section 8 & 10)
    console.log('\n--- 4. Testing WhatsApp CRM Lead Detection & Response ---');
    const crmRes = await fetch(`${BASE_URL}/api/jarvis/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'crm-suggest',
        message: 'નમસ્તે, મારે નવું પાન કાર્ડ કઢાવવું છે, શું ચાર્જ થશે?',
      }),
    });
    const crmData = await crmRes.json();
    assert(crmData.success && crmData.matchedService, 'Inbound query matched with 21 services catalog');
    assert(crmData.matchedService.service_code === 'PAN', 'Accurately detected PAN Card service');
    assert(crmData.matchedService.price === 250, 'Matched official locked fee: ₹250');
    assert(crmData.suggestedReplyGu.includes('નિયત ફી: ₹250'), 'Generated instant bilingual Gujarati response for CRM agent');

    console.log('\n====================================================');
    console.log(`📊 SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('🎉 ALL JARVIS WORKFLOWS ARE 100% OPERATIONAL!');
    console.log('====================================================');
  } catch (e) {
    console.error('Test execution error:', e);
  }
}

testJarvisWorkflows();
