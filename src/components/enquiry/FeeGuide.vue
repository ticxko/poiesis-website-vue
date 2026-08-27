<template>
  <section id="panduan-fee" class="section fee ps-reveal">
    <div class="container">
      <header class="fee-head">
        <p class="ps-label">Panduan Fee</p>
        <h2 class="ps-h1 fee-title">Transparansi sejak awal.</h2>
        <p class="ps-lead fee-lead">
          Fee desain kami dihitung dari <strong>persentase perkiraan biaya konstruksi</strong> (bukan paket
          harga tetap), mengikuti tabel honorarium Ikatan Arsitek Indonesia (Kategori 3, untuk rumah tinggal
          pribadi dan bangunan institusional).
        </p>
      </header>

      <div class="fee-grid">
        <details class="fee-item" open>
          <summary><span class="fee-num">01</span><span class="fee-q">Bagaimana fee dihitung</span></summary>
          <div class="fee-a">
            <p>Setelah kami mengetahui lahan, gaya yang diinginkan, dan aturan bangunan setempat (GSB, KDB, KLB),
              kami memperkirakan biaya konstruksi. Persentase honorarium IAI dikalikan estimasi tersebut.
              Angka inilah yang kami sampaikan sebagai fee desain.</p>
          </div>
        </details>

        <details class="fee-item">
          <summary><span class="fee-num">02</span><span class="fee-q">Yang sudah termasuk</span></summary>
          <div class="fee-a">
            <ul class="fee-list">
              <li><strong>Selama proses desain.</strong> Revisi, drafting, dan konsultasi fleksibel sepanjang pekerjaan berjalan.</li>
              <li><strong>Pemilihan material.</strong> Pendampingan memilih material dan menemani Anda ke galeri.</li>
              <li><strong>Perjalanan.</strong> Biaya perjalanan tim selama proyek berada di Jawa dan Bali.</li>
            </ul>
          </div>
        </details>

        <details class="fee-item">
          <summary><span class="fee-num">03</span><span class="fee-q">Termin pembayaran</span></summary>
          <div class="fee-a">
            <ol class="termin">
              <li v-for="t in termin" :key="t.code" class="termin-step">
                <span class="termin-pct">{{ t.pct }}</span>
                <span class="termin-body">
                  <span class="termin-code">{{ t.code }}</span>
                  <span class="termin-label">{{ t.label }}</span>
                </span>
              </li>
            </ol>
          </div>
        </details>

        <details class="fee-item">
          <summary><span class="fee-num">04</span><span class="fee-q">Belum termasuk</span></summary>
          <div class="fee-a">
            <p>Seluruh biaya belum termasuk PPh sebesar 2 persen.</p>
          </div>
        </details>
      </div>
    </div>
  </section>
</template>

<script setup>
const termin = [
  { code: 'DP 1', pct: '10%', label: 'Persetujuan proposal' },
  { code: 'DP 2', pct: '40%', label: 'Persetujuan desain' },
  { code: 'DP 3', pct: '40%', label: 'Gambar kerja & BoQ' },
  { code: 'Final', pct: '10%', label: 'Tender & serah terima' },
]
</script>

<style lang="scss" scoped>
.fee { border-top: var(--border-hairline); background: var(--ground-alt); }
.fee-head { max-width: var(--measure-headline); margin-bottom: 44px; }
.fee-title { margin-top: 14px; }
.fee-lead { margin-top: 18px; max-width: 60ch; strong { font-weight: var(--weight-medium); color: var(--ink); } }

.fee-grid {
  display: grid;
  gap: 0;
  border-top: var(--border-soft);
}

.fee-item {
  border-bottom: var(--border-soft);

  summary {
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 22px 0;
    cursor: pointer;
    list-style: none;
    &::-webkit-details-marker { display: none; }
  }
  summary::after {
    content: '';
    margin-left: auto;
    width: 10px;
    height: 10px;
    border: solid var(--ink-label);
    border-width: 0 1.5px 1.5px 0;
    transform: rotate(45deg);
    transition: transform var(--dur) var(--ease);
  }
  &[open] summary::after { transform: rotate(-135deg); }
}

.fee-num { font: var(--weight-light) 18px/1 var(--font-editorial); font-style: italic; color: var(--ink-label); min-width: 24px; }
.fee-q { font: var(--weight-medium) var(--t-h3)/1.3 var(--font-ui); color: var(--ink); }

.fee-a {
  padding: 0 0 26px 42px;
  font: var(--weight-regular) 15.5px/1.7 var(--font-ui);
  color: var(--ink-soft);
  max-width: 66ch;

  @media (max-width: 560px) { padding-left: 0; }
}
.fee-list { display: flex; flex-direction: column; gap: 12px; li { padding-left: 16px; position: relative; } }
.fee-list li::before { content: '·'; position: absolute; left: 0; color: var(--ink-label); }
.fee-list strong { color: var(--ink); font-weight: var(--weight-medium); }

.termin {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;

  @media (max-width: 700px) { grid-template-columns: 1fr 1fr; }
  @media (max-width: 400px) { grid-template-columns: 1fr; }
}
.termin-step {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 18px;
  background: var(--neutral-white);
  border: 1px solid var(--rule);
}
.termin-pct { font: var(--weight-light) 30px/1 var(--font-editorial); color: var(--ink); }
.termin-body { display: flex; flex-direction: column; gap: 2px; }
.termin-code { font: var(--weight-medium) 11px/1.2 var(--font-ui); letter-spacing: var(--track-caps); text-transform: uppercase; color: var(--pink-crimson); }
.termin-label { font: var(--weight-regular) 13.5px/1.4 var(--font-ui); color: var(--ink-soft); }
</style>
