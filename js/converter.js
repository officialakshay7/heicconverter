(function () {
  function initHeicConverter(opts) {
    var format = opts.format || "auto"; // 'jpg' | 'png' | 'auto'
    var dropZone = document.getElementById(opts.dropZoneId);
    var fileInput = document.getElementById(opts.fileInputId);
    var browseBtn = document.getElementById(opts.browseBtnId);
    var resultsList = document.getElementById(opts.resultsId);
    var emptyState = opts.emptyStateId ? document.getElementById(opts.emptyStateId) : null;
    var formatToggle = opts.formatToggleId ? document.getElementById(opts.formatToggleId) : null;
    var qualityWrap = opts.qualityWrapId ? document.getElementById(opts.qualityWrapId) : null;
    var qualitySlider = opts.qualitySliderId ? document.getElementById(opts.qualitySliderId) : null;
    var qualityValue = opts.qualityValueId ? document.getElementById(opts.qualityValueId) : null;
    var downloadAllBtn = opts.downloadAllId ? document.getElementById(opts.downloadAllId) : null;
    var counterEl = opts.counterId ? document.getElementById(opts.counterId) : null;

    var currentFormat = format === "auto" ? "jpg" : format;
    var converted = [];

    if (formatToggle) {
      var toggleBtns = formatToggle.querySelectorAll("[data-format]");
      toggleBtns.forEach(function (btn) {
        btn.addEventListener("click", function () {
          currentFormat = btn.getAttribute("data-format");
          toggleBtns.forEach(function (b) {
            b.classList.remove("bg-ink", "text-paper");
            b.classList.add("text-inkmute");
          });
          btn.classList.add("bg-ink", "text-paper");
          btn.classList.remove("text-inkmute");
          if (qualityWrap) qualityWrap.classList.toggle("hidden", currentFormat !== "jpg");
        });
      });
    }

    if (qualitySlider && qualityValue) {
      qualitySlider.addEventListener("input", function () {
        qualityValue.textContent = qualitySlider.value + "%";
      });
    }

    function isHeic(file) {
      var name = file.name.toLowerCase();
      return (
        name.endsWith(".heic") ||
        name.endsWith(".heif") ||
        file.type === "image/heic" ||
        file.type === "image/heif"
      );
    }

    function humanSize(bytes) {
      if (bytes < 1024) return bytes + " B";
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
      return (bytes / 1024 / 1024).toFixed(2) + " MB";
    }

    function updateCounter() {
      if (!counterEl) return;
      counterEl.textContent =
        converted.length + (converted.length === 1 ? " file converted" : " files converted");
    }

    async function processFile(file) {
      var toType = currentFormat === "png" ? "image/png" : "image/jpeg";
      var ext = currentFormat === "png" ? "png" : "jpg";

      var row = document.createElement("div");
      row.className =
        "flex items-center justify-between gap-4 border border-line rounded-xl p-4 bg-white/70";
      row.innerHTML =
        '<div class="flex items-center gap-3 min-w-0">' +
        '<span class="font-mono text-[11px] px-2 py-1 rounded bg-amber-50 text-amber-600 shrink-0">HEIC</span>' +
        '<span class="truncate text-sm text-ink">' +
        file.name +
        "</span>" +
        "</div>" +
        '<div class="flex items-center gap-3 shrink-0" data-status>' +
        '<span class="text-xs text-inkmute font-mono">Converting&hellip;</span>' +
        "</div>";
      resultsList.prepend(row);

      try {
        var callOpts = { blob: file, toType: toType };
        if (currentFormat !== "png") {
          callOpts.quality = qualitySlider ? Number(qualitySlider.value) / 100 : 0.85;
        }
        var resultBlob = await heic2any(callOpts);
        if (Array.isArray(resultBlob)) resultBlob = resultBlob[0];

        var url = URL.createObjectURL(resultBlob);
        var newName = file.name.replace(/\.(heic|heif)$/i, "") + "." + ext;
        converted.push({ name: newName, blob: resultBlob, url: url });

        var statusEl = row.querySelector("[data-status]");
        statusEl.innerHTML =
          '<span class="stamp-badge !text-teal-500 !border-teal-500/30">' +
          ext.toUpperCase() +
          " &middot; " +
          humanSize(resultBlob.size) +
          "</span>" +
          '<a href="' +
          url +
          '" download="' +
          newName +
          '" class="btn-secondary !px-4 !py-2 !text-xs">Download</a>';
      } catch (err) {
        var statusEl2 = row.querySelector("[data-status]");
        statusEl2.innerHTML =
          '<span class="text-xs text-red-600 font-mono">Failed &mdash; try another file</span>';
        console.error("HEIC conversion failed:", err);
      }
    }

    async function handleFiles(fileList) {
      var files = Array.from(fileList).filter(isHeic);
      if (!files.length) return;
      if (emptyState) emptyState.classList.add("hidden");
      for (var i = 0; i < files.length; i++) {
        await processFile(files[i]);
      }
      updateCounter();
      if (downloadAllBtn) downloadAllBtn.classList.toggle("hidden", converted.length === 0);
    }

    if (dropZone) {
      ["dragenter", "dragover"].forEach(function (evt) {
        dropZone.addEventListener(evt, function (e) {
          e.preventDefault();
          e.stopPropagation();
          dropZone.classList.add("border-amber-500", "bg-amber-50/40");
        });
      });
      ["dragleave", "drop"].forEach(function (evt) {
        dropZone.addEventListener(evt, function (e) {
          e.preventDefault();
          e.stopPropagation();
          dropZone.classList.remove("border-amber-500", "bg-amber-50/40");
        });
      });
      dropZone.addEventListener("drop", function (e) {
        handleFiles(e.dataTransfer.files);
      });
    }

    if (browseBtn && fileInput) {
      browseBtn.addEventListener("click", function () {
        fileInput.click();
      });
    }
    if (fileInput) {
      fileInput.addEventListener("change", function () {
        handleFiles(fileInput.files);
        fileInput.value = "";
      });
    }

    if (downloadAllBtn) {
      downloadAllBtn.addEventListener("click", function () {
        converted.forEach(function (item, i) {
          setTimeout(function () {
            var a = document.createElement("a");
            a.href = item.url;
            a.download = item.name;
            document.body.appendChild(a);
            a.click();
            a.remove();
          }, i * 250);
        });
      });
    }
  }

  window.initHeicConverter = initHeicConverter;
})();
