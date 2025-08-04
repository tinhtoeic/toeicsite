async function loadComponent(id, file) {
  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error("Failed to load component");
    const content = await response.text();
    document.getElementById(id).innerHTML = content;
  } catch (error) {
    console.error(`Error loading ${file}:`, error);
  }
}

const tests = [
  { part: 1, test: 1, url: "part1_practice1.html" },
  { part: 1, test: 2, url: "part1_practice2.html" },
  { part: 5, test: 1, url: "part5_practice1.html" },
  // Thêm đề khác nếu cần: { part: 1, test: 2, url: 'part1_practice2.html' }
];

const practiceData = {
  part1: [
    {
      test: 1,
      form: "https://forms.gle/g6gV6gsYoqyA9qXq9",
      audio: [
        {
          name: "Âm thanh 1: Mô tả hình ảnh 1",
          url: "/audio/Test_01-Part1.mp3",
        },
      ],
    },
    {
      test: 2,
      form: "https://forms.gle/g6gV6gsYoqyA9qXq9",
      audio: [
        {
          name: "Âm thanh 1: Mô tả hình ảnh 1",
          url: "/audio/Test_01-Part1.mp3",
        },
      ],
    },
  ],
  part5: [
    {
      test: 1,
      pdf: "TEST_3.pdf",
      form: "https://forms.gle/AZefPC68Rz2dZpFL7",
    },
  ],
};

function renderTestList() {
  const partLists = document.querySelectorAll(".practice-list");
  partLists.forEach((list) => {
    const partNumber = list
      .closest(".part")
      .querySelector(".part-toggle")
      .textContent.match(/\d+/);
    if (partNumber && (partNumber[0] === "1" || partNumber[0] === "5")) {
      const partTests = tests.filter((t) => t.part == partNumber[0]);
      list.innerHTML =
        "<ul>" +
        partTests
          .map((t) => `<li><a href="${t.url}">Đề ${t.test}</a></li>`)
          .join("") +
        "</ul>";
    }
  });
}

function renderPracticePage(part, test) {
  if (part === "1") {
    const data = practiceData.part1.find((p) => p.test == test);
    if (data) {
      document.querySelector(".form-section iframe").src = data.form;
      const audioList = document.querySelector(".audio-list");
      audioList.innerHTML = data.audio
        .map(
          (a) => `
        <li>
          <span>${a.name}</span>
          <audio controls>
            <source src="${a.url}" type="audio/mpeg">
            Trình duyệt của bạn không hỗ trợ phát âm thanh.
          </audio>
        </li>
      `
        )
        .join("");
    }
  } else if (part === "5") {
    const data = practiceData.part5.find((p) => p.test == test);
    if (data) {
      document.querySelector(".pdf-section iframe").src = data.pdf;
      document.querySelector(".form-section iframe").src = data.form;
    }
  }
}

function showLoading(section) {
  const iframe = section.querySelector("iframe");
  const loading = document.createElement("div");
  loading.textContent = "Đang tải nội dung...";
  loading.style.color = "#007BFF";
  loading.style.textAlign = "center";
  loading.style.padding = "10px";
  section.appendChild(loading);
  iframe.onload = () => loading.remove();
}

function setupPartToggle() {
  document.querySelectorAll(".part-toggle").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const practiceList = toggle.nextElementSibling;
      const isActive = practiceList.classList.contains("active");
      document.querySelectorAll(".practice-list").forEach((list) => {
        list.classList.remove("active");
      });
      if (!isActive) {
        practiceList.classList.add("active");
      }
    });
  });
}

function setupAudioPlayer() {
  const select = document.getElementById("audioSelect");
  const audioPlayer = document.getElementById("audioPlayer");
  if (select && audioPlayer) {
    select.addEventListener("change", () => {
      const selectedAudio = select.value;
      if (selectedAudio) {
        audioPlayer.src = selectedAudio;
        audioPlayer.play();
      } else {
        audioPlayer.pause();
        audioPlayer.src = "";
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadComponent("header", "header.html");
  loadComponent("footer", "footer.html");
  if (document.querySelector(".practice-list")) {
    renderTestList();
    setupPartToggle();
    setupAudioPlayer();
  }
  if (
    document.querySelector(".listening-practice-layout") ||
    document.querySelector(".reading-practice-layout")
  ) {
    const urlParams = new URLSearchParams(window.location.search);
    const part =
      urlParams.get("part") ||
      (document.querySelector(".listening-practice-layout") ? "1" : "5");
    const test = urlParams.get("test") || "1";
    renderPracticePage(part, test);
    document
      .querySelectorAll(".form-section, .pdf-section")
      .forEach(showLoading);
  }
});
