import './style.css'

// Screen Data
const screens = {
  home: `
    <div id="home-screen" class="animate-fade">
      <div class="hadith-card">
        <p class="urdu hadith-text">
          "جو شخص حلال روزی کماتا ہے، اللہ تعالیٰ اس کے رزق میں برکت عطا فرماتا ہے۔"
        </p>
      </div>
      <section class="hero">
        <div class="hero-banner">
          <span class="star-badge">NO. 1 FLAGSHIP PRODUCT</span>
          <h2 class="urdu">سیٹھ محمد طفیل ٹوکہ</h2>
          <p>The Original Chaff Cutter Machine</p>
          <img src="https://img.freepik.com/free-vector/red-tractor-flat-style_1308-41006.jpg" alt="Toka Machine" class="hero-image">
          <button class="btn-primary urdu">ابھی آرڈر کریں</button>
        </div>
      </section>
      <section class="featured-products">
        <div class="section-title">
          <span>Our Products</span>
          <span class="urdu">ہماری مصنوعات</span>
        </div>
        <div class="product-grid">
           <div class="product-card">
            <img src="https://cdn-icons-png.flaticon.com/512/3241/3241198.png" alt="Wheat Thresher">
            <h3>Wheat Thresher 5 FT</h3>
            <p class="price">Rs. 1,050,000</p>
          </div>
          <div class="product-card">
            <img src="https://cdn-icons-png.flaticon.com/512/2900/2900350.png" alt="Rotavator">
            <h3>Rotavator</h3>
            <p class="price">Rs. 360,000</p>
          </div>
        </div>
      </section>
    </div>
  `,
  about: `
    <div id="about-screen" class="animate-fade" style="padding: 1.5rem">
      <h2 class="urdu" style="color: var(--primary-red); font-size: 2rem; margin-bottom: 1rem">ہمارے بارے میں</h2>
      <p style="margin-bottom: 1.5rem">Founded in the 1980s, Seth Muhammad Tufail & Sons has been the backbone of Pakistan's agricultural sector for over 40 years.</p>
      
      <div style="background: var(--light-grey); padding: 1.5rem; border-radius: 15px; border-left: 5px solid var(--primary-red)">
        <h3 class="urdu" style="margin-bottom: 1rem">خاندانی شجرہ (Family Tree)</h3>
        <div style="display: flex; flex-direction: column; gap: 1rem">
          <div style="padding: 1rem; background: white; border-radius: 8px; box-shadow: var(--shadow)">
            <strong>Seth Muhammad Akbar</strong>
            <p>Son: Seth Muhammad Ahmed</p>
          </div>
          <div style="padding: 1rem; background: white; border-radius: 8px; box-shadow: var(--shadow)">
            <strong>Seth Muhammad Iftakhar</strong>
            <p>Son: Seth Muhammad Qasim</p>
          </div>
        </div>
      </div>
    </div>
  `,
  dealers: `
    <div id="dealers-screen" class="animate-fade" style="padding: 1.5rem">
      <h2 class="urdu" style="color: var(--primary-red); font-size: 2rem; margin-bottom: 1rem">ڈیلر نیٹ ورک</h2>
      <div style="height: 250px; background: #eee; border-radius: 15px; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem">
        <p>Interactive Map Loading...</p>
      </div>
      <input type="text" placeholder="Search City..." style="width: 100%; padding: 1rem; border-radius: 10px; border: 1px solid #ddd; margin-bottom: 1rem">
      <ul style="list-style: none">
        <li style="padding: 1rem; border-bottom: 1px solid #eee"><strong>Faisalabad:</strong> Samundri Road</li>
        <li style="padding: 1rem; border-bottom: 1px solid #eee"><strong>Lahore:</strong> Badami Bagh</li>
        <li style="padding: 1rem; border-bottom: 1px solid #eee"><strong>Multan:</strong> Vehari Road</li>
      </ul>
    </div>
  `,
  products: `
    <div id="products-screen" class="animate-fade" style="padding: 1.5rem">
      <h2 class="urdu" style="color: var(--primary-red); font-size: 2rem; margin-bottom: 1rem">مکمل فہرست</h2>
      <div class="product-grid" style="padding: 0">
        <div class="product-card"><h3>Seth Toka</h3><p>Reg: 68828</p></div>
        <div class="product-card"><h3>Nabi Toka</h3><p>Reg: 72654</p></div>
        <div class="product-card"><h3>Tufail Toka</h3><p>Reg: 313436</p></div>
        <div class="product-card"><h3>12V Pump</h3><p>Rs. 15,900</p></div>
      </div>
    </div>
  `
}

window.showScreen = (screenName) => {
  const content = document.getElementById('app-content')
  content.innerHTML = screens[screenName]
  
  // Update nav active state
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active')
    if (item.querySelector('span').innerText.toLowerCase() === screenName) {
      item.classList.add('active')
    }
  })
}

console.log('Seth M. Tufail Foundry App Initialized')
