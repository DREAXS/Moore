function toggleTheme() {
  // "dark-theme" sınıfını body etiketine ekleyip çıkarıyoruz
  document.body.classList.toggle("dark-theme");
}

function simulate() {
  // Kullanıcıdan alınan girdileri al ve işlemeye başla
  const statesInput = document
    .getElementById("states")
    .value.split(",")
    .map((s) => s.trim()); // Durumları virgülle ayırarak bir dizi haline getir
  const alphabetInput = document
    .getElementById("alphabet")
    .value.split(",")
    .map((s) => s.trim()); // Alfabe sembollerini virgülle ayırarak bir dizi haline getir
  const outputsInput = document
    .getElementById("outputs")
    .value.split(",")
    .map((s) => s.trim()); // Çıkış sembollerini virgülle ayırarak bir dizi haline getir
  const transitionsInput = document.getElementById("transitions").value.trim(); // Geçişleri al
  const startState = document.getElementById("startState").value.trim(); // Başlangıç durumunu al
  const inputString = document.getElementById("inputString").value.trim(); // Girdi dizisini al

  // Girdilerin doğruluğunu kontrol et
  if (
    statesInput.length === 0 ||
    alphabetInput.length === 0 ||
    outputsInput.length === 0
  ) {
    alert("Durumlar, Giriş Alfabesi ve Çıkış Sembolleri alanları boş olamaz.");
    return;
  }

  if (!startState || !statesInput.includes(startState)) {
    alert("Geçerli bir başlangıç durumu girin.");
    return;
  }

  if (outputsInput.length < statesInput.length) {
    alert("Her duruma karşılık gelen bir çıkış sembolü belirtin.");
    return;
  }

  // Durumlar ve çıkışlar için bir geçiş tablosu oluştur
  let transitions = {};
  statesInput.forEach((state, index) => {
    transitions[state] = { output: outputsInput[index] || "" }; // Her duruma karşılık bir çıkış
  });

  // Geçiş tanımlarını işle
  transitionsInput.split(";").forEach((trans) => {
    const [currentTransition, nextState] = trans
      .split("=")
      .map((s) => s.trim()); // Geçişleri ayır
    if (!currentTransition || !nextState) return;

    const [currentState, symbol] = currentTransition
      .split(",")
      .map((s) => s.trim()); // Mevcut durum ve sembolü ayır

    // Hatalı geçişleri kontrol et
    if (!transitions[currentState] || !alphabetInput.includes(symbol)) {
      alert(
        `Geçersiz geçiş ifadesi: '${currentTransition}=${nextState}'. Lütfen doğru formatı kullanın.`
      );
      return;
    }

    // Geçişi tabloya ekle
    transitions[currentState][symbol] = nextState;
  });

  // Moore Makinesi Simülasyonu
  let currentState = startState;
  let outputString = "";

  // İlk durumu dahil et (Moore makinelerinde ilk durumun çıkışı da alınır)
  outputString += transitions[currentState].output;

  // Girdi dizisini simüle et
  for (let symbol of inputString) {
    const stateData = transitions[currentState];

    // Geçerli durumu kontrol et
    if (!stateData) {
      alert(`Hata: Durum '${currentState}' tanımlı değil.`);
      return;
    }

    // Geçiş yap
    const nextState = stateData[symbol];
    if (nextState) {
      currentState = nextState;
      outputString += transitions[currentState].output; // Yeni durumun çıkışını ekle
    } else {
      alert(
        `Hata: '${currentState}' durumunda '${symbol}' sembolü için geçiş tanımlı değil.`
      );
      return;
    }
  }

  // Çıkışı ekrana yazdır
  document.getElementById("output").innerText = `Çıkış: ${outputString}`;
}
