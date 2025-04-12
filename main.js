let lastScrollPosition = 0;
    let isPrayerMenuOpen = false;

    document.addEventListener('DOMContentLoaded', function () {
      const colors = ['rgba(0, 173, 181, 0.3)', 'rgba(255, 211, 105, 0.3)', 'rgba(238, 238, 238, 0.3)'];
      for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = Math.random() * 10 + 5;
        const posX = Math.random() * window.innerWidth;
        const posY = Math.random() * window.innerHeight;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 10;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}px`;
        particle.style.top = `${posY}px`;
        particle.style.background = color;
        particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
        document.body.appendChild(particle);
      }

      initScrollEffects();

      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const today = new Date();
      document.getElementById('currentDate').textContent = today.toLocaleDateString('ar-EG', options);

      loadRandomAyah();

      loadPrayerTimesForEgypt();

      document.getElementById('refreshPrayerTimes').addEventListener('click', function () {
        loadPrayerTimesForEgypt();
      });

      document.getElementById('prayerToggleBtn').addEventListener('click', function () {
        const prayerContainer = document.getElementById('prayerTimesContainer');
        prayerContainer.classList.toggle('show');
        isPrayerMenuOpen = prayerContainer.classList.contains('show');

        const icon = this.querySelector('i');
        if (isPrayerMenuOpen) {
          icon.classList.remove('fa-mosque');
          icon.classList.add('fa-times');
          this.querySelector('span').textContent = 'إغلاق';
        } else {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-mosque');
          this.querySelector('span').textContent = 'أوقات الصلاة';
        }
      });

      document.addEventListener('click', function (event) {
        const prayerContainer = document.getElementById('prayerTimesContainer');
        const toggleBtn = document.getElementById('prayerToggleBtn');

        if (!prayerContainer.contains(event.target) && !toggleBtn.contains(event.target)) {
          if (prayerContainer.classList.contains('show')) {
            prayerContainer.classList.remove('show');
            isPrayerMenuOpen = false;
            const icon = toggleBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-mosque');
            toggleBtn.querySelector('span').textContent = 'أوقات الصلاة';
          }
        }
      });
    });

    function handleScrollDirection() {
      const currentScrollPosition = window.scrollY || document.documentElement.scrollTop;
      const prayerContainer = document.getElementById('prayerTimesContainer');
      const toggleBtn = document.getElementById('prayerToggleBtn');

      if (currentScrollPosition > lastScrollPosition) {
        if (prayerContainer.classList.contains('show')) {
          prayerContainer.classList.remove('show');
          isPrayerMenuOpen = true; // نحتفظ بحالة أنها كانت مفتوحة
        }
      }
      else if (currentScrollPosition < lastScrollPosition) {
        if (isPrayerMenuOpen && currentScrollPosition < 100) {
          prayerContainer.classList.add('show');
        }
      }

      if (currentScrollPosition <= 0) {
        isPrayerMenuOpen = false;
      }

      lastScrollPosition = currentScrollPosition;
    }

    function shareWebsite() {
      if (navigator.share) {
        navigator.share({
          title: document.title,
          url: window.location.href
        }).then(() => {
          console.log('تمت مشاركة الرابط بنجاح');
        }).catch((error) => {
          console.error('حدث خطأ أثناء مشاركة الرابط: ', error);
        });
      } else {
        alert("متصفحك لا يدعم ميزة المشاركة، يمكنك نسخ الرابط يدوياً: " + window.location.href);
      }
    }

    function scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }

    window.onscroll = function () {
      showScrollButton();
      updateProgressBar();
      togglePrayerButtonVisibility();
      handleScrollDirection();
    };

    function showScrollButton() {
      const btn = document.getElementById("scrollTopBtn");
      if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        btn.style.display = "flex";
      } else {
        btn.style.display = "none";
      }
    }

    function togglePrayerButtonVisibility() {
      const prayerBtn = document.getElementById("prayerToggleBtn");
      const scrollPosition = window.scrollY || document.documentElement.scrollTop;

      if (scrollPosition > 100) {
        prayerBtn.classList.add('hide');
      } else {
        prayerBtn.classList.remove('hide');
      }
    }

    function updateProgressBar() {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      document.getElementById("progressBar").style.width = scrolled + "%";
    }

    function initScrollEffects() {
      const scrollElements = document.querySelectorAll('.scroll-effect');

      const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
          elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
      };

      const displayScrollElement = (element) => {
        element.classList.add('visible');
      };

      const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
          if (elementInView(el, 1.2)) {
            displayScrollElement(el);
          }
        });
      };

      scrollElements.forEach((el) => {
        if (elementInView(el, 1.2)) {
          displayScrollElement(el);
        }
      });

      window.addEventListener('scroll', () => {
        handleScrollAnimation();
      });
    }

    async function loadRandomAyah() {
      try {
        const ayahs = [
          { text: "يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَقُولُوا قَوْلًا سَدِيدًا", surah: "سورة الأحزاب - الآية 70" },
          { text: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", surah: "سورة البقرة - الآية 153" },
          { text: "وَذَكِّرْ فَإِنَّ الذِّكْرَىٰ تَنفَعُ الْمُؤْمِنِينَ", surah: "سورة الذاريات - الآية 55" },
          { text: "وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ ۚ عَلَيْهِ تَوَكَّلْتُ وَإِلَيْهِ أُنِيبُ", surah: "سورة هود - الآية 88" },
          { text: "وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ وَإِنَّهَا لَكَبِيرَةٌ إِلَّا عَلَى الْخَاشِعِينَ", surah: "سورة البقرة - الآية 45" },
          { text: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", surah: "سورة البقرة - الآية 201" },
          { text: "إِنَّمَا يُوَفَّى الصَّابِرُونَ أَجْرَهُم بِغَيْرِ حِسَابٍ", surah: "سورة الزمر - الآية 10" },
          { text: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا", surah: "سورة الطلاق - الآية 2" },
          { text: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا، إِنَّ مَعَ الْعُسْرِ يُسْرًا", surah: "سورة الشرح - الآية 5-6" },
          { text: "وَتَوَكَّلْ عَلَى الْحَيِّ الَّذِي لَا يَمُوتُ", surah: "سورة الفرقان - الآية 58" },
          { text: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ", surah: "سورة البقرة - الآية 186" },
          { text: "وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ ۖ إِنَّهُ لَا يَيْأَسُ مِن رَّوْحِ اللَّهِ إِلَّا الْقَوْمُ الْكَافِرُونَ", surah: "سورة يوسف - الآية 87" },
          { text: "وَلَنَبْلُوَنَّكُم بِشَيْءٍ مِّنَ الْخَوْفِ وَالْجُوعِ وَنَقْصٍ مِّنَ الْأَمْوَالِ وَالْأَنفُسِ وَالثَّمَرَاتِ ۗ وَبَشِّرِ الصَّابِرِينَ", surah: "سورة البقرة - الآية 155" },
          { text: "وَمَا أَصَابَكُم مِّن مُّصِيبَةٍ فَبِمَا كَسَبَتْ أَيْدِيكُمْ وَيَعْفُو عَن كَثِيرٍ", surah: "سورة الشورى - الآية 30" },
          { text: "إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّىٰ يُغَيِّرُوا مَا بِأَنفُسِهِمْ", surah: "سورة الرعد - الآية 11" }
        ];

        const randomAyah = ayahs[Math.floor(Math.random() * ayahs.length)];
        document.getElementById('randomAyahText').textContent = `"${randomAyah.text}"`;
        document.querySelector('.random-ayah .surah-name').textContent = randomAyah.surah;

        typeWriterEffect('randomAyahText', `"${randomAyah.text}"`);
      } catch (error) {
        console.error('Error loading random ayah:', error);
      }
    }
setInterval(loadRandomAyah, 8000);

    function typeWriterEffect(elementId, text) {
      const element = document.getElementById(elementId);
      element.textContent = '';
      let i = 0;
      const speed = 50; 

      function type() {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
          setTimeout(type, speed);
        }
      }

      type();
    }

    async function loadPrayerTimesForEgypt() {
  try {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await fetchPrayerTimes(latitude, longitude, true);

          const city = await getCityName(latitude, longitude);
          document.getElementById('locationInfo').textContent = `موقعك الحالي: ${city || 'غير معروف'}`;
          document.getElementById('prayerLocation').textContent = city ? `${city}، مصر` : 'مصر';
        },
        async (error) => {
          console.error('Error getting location:', error);
          
         
          await fetchPrayerTimes(30.5877, 31.5020, false);
          document.getElementById('locationInfo').textContent = 'تستخدم أوقات الصلاة لمدينة الزقازيق (تحديد الموقع غير متاح)';
          document.getElementById('prayerLocation').textContent = 'الزقازيق، مصر';
        }
      );
    } else {
     
      await fetchPrayerTimes(30.5877, 31.5020, false);
      document.getElementById('locationInfo').textContent = 'تستخدم أوقات الصلاة لمدينة الزقازيق (تحديد الموقع غير مدعوم)';
      document.getElementById('prayerLocation').textContent = 'الزقازيق، مصر';
    }
  } catch (error) {
    console.error('Error loading prayer times:', error);
    document.getElementById('locationInfo').textContent = 'حدث خطأ في جلب أوقات الصلاة';
  }
}


    async function fetchPrayerTimes(lat, lng, isUserLocation) {
      try {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const response = await fetch(
          `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${lat}&longitude=${lng}&method=5`
        );

        const data = await response.json();

        if (data.code === 200 && data.data) {
          const timings = data.data.timings;

          document.getElementById('fajrValue').textContent = formatTime(timings.Fajr);
          document.getElementById('dhuhrValue').textContent = formatTime(timings.Dhuhr);
          document.getElementById('asrValue').textContent = formatTime(timings.Asr);
          document.getElementById('maghribValue').textContent = formatTime(timings.Maghrib);
          document.getElementById('ishaValue').textContent = formatTime(timings.Isha);

          highlightCurrentPrayer(timings);

          if (!isUserLocation && data.data.meta && data.data.meta.timezone) {
            const city = data.data.meta.timezone.split('/')[1] || 'القاهرة';
            document.getElementById('locationInfo').textContent = `تستخدم أوقات الصلاة لمدينة ${city}`;
            document.getElementById('prayerLocation').textContent = `${city}، مصر`;
          }
        }
      } catch (error) {
        console.error('Error fetching prayer times:', error);
        throw error;
      }
    }

    function formatTime(timeStr) {
      return timeStr.substring(0, 5); 
    }

    function highlightCurrentPrayer(timings) {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      document.querySelectorAll('.prayer-time').forEach(el => {
        el.classList.remove('active');
      });

      const prayerTimes = [
        { name: 'fajrTime', time: convertToMinutes(timings.Fajr) },
        { name: 'dhuhrTime', time: convertToMinutes(timings.Dhuhr) },
        { name: 'asrTime', time: convertToMinutes(timings.Asr) },
        { name: 'maghribTime', time: convertToMinutes(timings.Maghrib) },
        { name: 'ishaTime', time: convertToMinutes(timings.Isha) }
      ];

      let currentPrayer = null;
      for (let i = 0; i < prayerTimes.length; i++) {
        if (currentTime < prayerTimes[i].time) {
          currentPrayer = i > 0 ? prayerTimes[i - 1].name : prayerTimes[prayerTimes.length - 1].name;
          break;
        }
      }

      if (!currentPrayer) {
        currentPrayer = prayerTimes[prayerTimes.length - 1].name;
      }

      document.getElementById(currentPrayer).classList.add('active');
      document.getElementById('currentPrayerTitle').textContent =
        document.getElementById(currentPrayer).querySelector('.prayer-name').textContent;
    }

    function convertToMinutes(timeStr) {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    }

    async function getCityName(lat, lng) {
      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=ar`
        );
        const data = await response.json();
        return data.city || data.locality || null;
      } catch (error) {
        console.error('Error getting city name:', error);
        return null;
      }
    }
