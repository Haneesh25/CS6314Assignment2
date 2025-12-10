  </main>
  <footer class="site-footer">
    <div>
      Font size:
      <button onclick="document.documentElement.style.setProperty('--main-font-size','14px'); localStorage.setItem('fontSize','14px')">Small</button>
      <button onclick="document.documentElement.style.setProperty('--main-font-size','16px'); localStorage.setItem('fontSize','16px')">Normal</button>
      <button onclick="document.documentElement.style.setProperty('--main-font-size','18px'); localStorage.setItem('fontSize','18px')">Large</button>
    </div>
    <div>
      Background:
      <button onclick="document.body.style.background='#ffffff'; localStorage.setItem('bgColor','#ffffff')">White</button>
      <button onclick="document.body.style.background='#f0f8ff'; localStorage.setItem('bgColor','#f0f8ff')">Light</button>
      <button onclick="document.body.style.background='#f5f5dc'; localStorage.setItem('bgColor','#f5f5dc')">Beige</button>
    </div>
  </footer>
</body>
</html>
