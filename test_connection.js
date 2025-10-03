// Simple test to check API connections
async function testConnections() {
  const baseUrl = 'http://localhost:8000';
  
  console.log('🧪 Testing API connections...\n');
  
  // Test health check
  try {
    console.log('1. Testing health check...');
    const healthResponse = await fetch(`${baseUrl}/health`);
    console.log(`   Status: ${healthResponse.status}`);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('   ✅ Health check successful:', JSON.stringify(healthData, null, 2));
    } else {
      console.log('   ❌ Health check failed');
    }
  } catch (error) {
    console.log('   ❌ Health check error:', error.message);
  }
  
  console.log('\n');
  
  // Test models endpoint
  try {
    console.log('2. Testing models endpoint...');
    const modelsResponse = await fetch(`${baseUrl}/models`);
    console.log(`   Status: ${modelsResponse.status}`);
    if (modelsResponse.ok) {
      const modelsData = await modelsResponse.json();
      console.log('   ✅ Models endpoint successful:');
      console.log('   Available models:', Object.keys(modelsData.available_models));
      Object.entries(modelsData.available_models).forEach(([key, model]) => {
        console.log(`     - ${key}: ${model.name} (${model.accuracy}% accuracy)`);
      });
    } else {
      console.log('   ❌ Models endpoint failed');
    }
  } catch (error) {
    console.log('   ❌ Models endpoint error:', error.message);
  }
}

// Run the test
testConnections();