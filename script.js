// 10 pernyataan kondisi untuk membaca situasi hubungan
const conditions = [
  "Dia sering mulai chat duluan, bukan cuma muncul pas butuh sesuatu.",
  "Kalau ngobrol, dia juga nanya kabarku dan benar-benar nyimak jawabannya.",
  "Dia ngajak ketemu dengan rencana yang jelas, bukan “kapan-kapan” terus.",
  "Usahanya terasa konsisten, bukan intens sehari lalu hilang seminggu.",
  "Dia nyaman terlihat bareng aku di depan teman-temannya.",
  "Kami bisa ngobrol soal hal yang agak serius tanpa dibikin bercanda terus.",
  "Dia menghargai waktuku dan tidak menghubungi cuma saat tengah malam atau gabut.",
  "Perhatiannya terasa personal, bukan perlakuan yang sama ke semua orang.",
  "Aku merasa aman jadi diri sendiri, bukan harus selalu tampil paling asik.",
  "Aku bisa membicarakan arah hubungan ini tanpa takut dianggap terlalu berharap."
];

const answerChoices = [
  { label: "Jarang banget", value: 0 },
  { label: "Kadang-kadang", value: 1 },
  { label: "Sering", value: 2 }
];

// Menu navigasi untuk tampilan HP
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });
}

// Menampilkan 10 pertanyaan pada halaman cek.html
const quizForm = document.querySelector("#quizForm");
const questionList = document.querySelector("#questionList");

if (quizForm && questionList) {
  questionList.innerHTML = conditions
    .map((question, index) => {
      const questionNumber = String(index + 1).padStart(2, "0");

      const optionsHTML = answerChoices
        .map(
          (choice) => `
            <label class="option">
              <input
                type="radio"
                name="q${index}"
                value="${choice.value}"
                required
              >
              <span>${choice.label}</span>
            </label>
          `
        )
        .join("");

      return `
        <fieldset class="question-card">
          <legend class="question-title">
            <span class="q-index">${questionNumber}</span>
            <span>${question}</span>
          </legend>
          <div class="options">
            ${optionsHTML}
          </div>
        </fieldset>
      `;
    })
    .join("");

  const progressText = document.querySelector("#progressText");
  const progressBar = document.querySelector("#progressBar");
  const resultBox = document.querySelector("#result");

  function updateProgress() {
    const answeredCount = conditions.filter((_, index) =>
      quizForm.querySelector(`input[name="q${index}"]:checked`)
    ).length;

    if (progressText) {
      progressText.textContent = `${answeredCount} / ${conditions.length}`;
    }

    if (progressBar) {
      const progressPercent = (answeredCount / conditions.length) * 100;
      progressBar.style.width = `${progressPercent}%`;
    }
  }

  quizForm.addEventListener("change", updateProgress);

  quizForm.addEventListener("reset", () => {
    setTimeout(() => {
      updateProgress();

      if (resultBox) {
        resultBox.hidden = true;
        resultBox.innerHTML = "";
      }
    }, 0);
  });

  quizForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Browser meminta pengguna menjawab semua pertanyaan terlebih dahulu.
    if (!quizForm.reportValidity()) {
      return;
    }

    const selectedAnswers = [
      ...quizForm.querySelectorAll('input[type="radio"]:checked')
    ];

    const totalScore = selectedAnswers.reduce(
      (total, answer) => total + Number(answer.value),
      0
    );

    // Skor disimpan di browser perangkat pengguna.
    localStorage.setItem("justFriendScore", String(totalScore));

    let resultTitle;
    let resultMessage;

    if (totalScore >= 15) {
      resultTitle = "Arusnya terasa cukup dua arah.";
      resultMessage =
        "Ada beberapa tanda usaha dan komunikasi yang saling hadir. Nikmati prosesnya, sambil tetap menjaga batas dan kebutuhanmu sendiri.";
    } else if (totalScore >= 8) {
      resultTitle = "Masih ada sinyal yang campur aduk.";
      resultMessage =
        "Beberapa hal terasa nyambung, tetapi belum semuanya konsisten. Daripada terus menebak, coba obrolkan hal yang penting buatmu.";
    } else {
      resultTitle = "Kamu mungkin sedang banyak mengayuh sendiri.";
      resultMessage =
        "Jawabanmu menunjukkan kebutuhanmu mungkin belum mendapat respons yang sepadan. Kamu boleh meminta kejelasan, mengambil jarak, atau memilih fokus ke diri sendiri.";
    }

    if (resultBox) {
      resultBox.innerHTML = `
        <div class="result-score">
          RANGKUMAN CHECK-IN · ${totalScore} / 20
        </div>
        <h2>${resultTitle}</h2>
        <p>${resultMessage}</p>
        <p>
          Skor ini bukan vonis status hubungan. Gunakan sebagai pemantik
          refleksi, lalu pertimbangkan juga pengalamanmu sendiri.
        </p>
      `;

      resultBox.hidden = false;
      resultBox.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }
  });

  updateProgress();
}

// Form jurnal pada halaman jurnal.html
const journalForm = document.querySelector("#journalForm");

if (journalForm) {
  const moodSelect = document.querySelector("#journalMood");
  const journalText = document.querySelector("#journalText");
  const charCount = document.querySelector("#charCount");
  const journalStatus = document.querySelector("#journalStatus");
  const savedJournal = document.querySelector("#savedJournal");
  const deleteButton = document.querySelector("#deleteJournal");

  const journalStorageKey = "justFriendJournal";

  function getSavedEntry() {
    try {
      const savedValue = localStorage.getItem(journalStorageKey);
      return savedValue ? JSON.parse(savedValue) : null;
    } catch (error) {
      return null;
    }
  }

  function displaySavedEntry() {
    const entry = getSavedEntry();

    if (entry && savedJournal) {
      const moodText = entry.mood ? `${entry.mood} · ` : "";
      savedJournal.textContent =
        `${moodText}${entry.date}\n\n${entry.text}`;

      if (deleteButton) {
        deleteButton.hidden = false;
      }
    } else {
      if (savedJournal) {
        savedJournal.textContent =
          "Belum ada catatan. Mulai dari satu kalimat kecil.";
      }

      if (deleteButton) {
        deleteButton.hidden = true;
      }
    }
  }

  if (journalText && charCount) {
    journalText.addEventListener("input", () => {
      charCount.textContent = `${journalText.value.length} / 1000`;
    });
  }

  journalForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!journalText || !journalText.value.trim()) {
      journalText?.focus();

      if (journalStatus) {
        journalStatus.textContent = "Tulis catatanmu dulu sebelum menyimpan.";
      }

      return;
    }

    const date = new Intl.DateTimeFormat("id-ID", {
      dateStyle: "long"
    }).format(new Date());

    const entry = {
      mood: moodSelect ? moodSelect.value : "",
      text: journalText.value.trim(),
      date
    };

    localStorage.setItem(journalStorageKey, JSON.stringify(entry));

    if (journalStatus) {
      journalStatus.textContent = "Catatan tersimpan di browser ini.";
    }

    displaySavedEntry();
  });

  if (deleteButton) {
    deleteButton.addEventListener("click", () => {
      localStorage.removeItem(journalStorageKey);

      if (journalStatus) {
        journalStatus.textContent = "Catatan sudah dihapus.";
      }

      displaySavedEntry();
    });
  }

  displaySavedEntry();
}