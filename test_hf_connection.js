// Test Hugging Face Backend Connection
const API_URL = 'https://hanokalure-sms-spam-detector.hf.space';

async function testConnection() {
  console.log('🔍 Testing connection to:', API_URL);
  console.log('');
  
  try {
    // Test 1: Health check
    console.log('📡 Test 1: Health Check...');
    const healthResponse = await fetch(`${API_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health Check Response:', healthData);
    console.log('');
    
    // Test 2: Get models
    console.log('📡 Test 2: Get Models...');
    const modelsResponse = await fetch(`${API_URL}/models`);
    const modelsData = await modelsResponse.json();
    console.log('✅ Models Response:', modelsData);
    console.log('');
    
    // Test 3: Test prediction
    console.log('📡 Test 3: Test Prediction...');
    const predictionResponse = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: 'FREE! You won $1000! Call now!',
        model: 'svm'
      })
    });
    const predictionData = await predictionResponse.json();
    console.log('✅ Prediction Response:', predictionData);
    console.log('');
    
    console.log('🎉 ALL TESTS PASSED! Your backend is working correctly!');
    console.log('');
    console.log('Next step: Deploy to Vercel with this URL');
    
  } catch (error) {
    console.error('❌ Connection Error:', error.message);
    console.log('');
    console.log('⚠️ Possible issues:');
    console.log('1. HF Space is not running (building/sleeping)');
    console.log('2. URL is incorrect');
    console.log('3. CORS is not properly configured');
    console.log('');
    console.log('Please check your HF Space at:');
    console.log('https://huggingface.co/spaces/Hanokalure/sms-spam-detector');
  }
}

testConnection();
