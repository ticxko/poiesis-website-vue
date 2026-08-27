<template>
  <main>
    <section class="section enquiry-sec">
      <div class="container">
        <div class="enquiry-grid ps-reveal">
          <!-- Contextual dark panel (collapses to a header on mobile) -->
          <EnquirySidePanel :reassurance="REASSURE[stepIndex]" />

          <!-- Wizard -->
          <div class="wizard">
            <!-- Restored-draft banner -->
            <div v-if="restoredBanner && status !== 'success'" class="restore-note" role="status">
              <span>Kami memulihkan jawaban Anda yang belum terkirim.</span>
              <button type="button" class="restore-reset" @click="resetAll">Mulai ulang</button>
            </div>

            <!-- Success -->
            <div v-if="status === 'success'" class="done" aria-live="polite">
              <p class="ps-label done-eyebrow">Terkirim</p>
              <h1 class="ps-h1 done-head">Terima kasih{{ answers.nama ? ', ' + firstName : '' }}.</h1>
              <p class="ps-body done-body">
                Enquiry Anda telah kami terima. Tim Poiesis akan meninjau dan menghubungi Anda dalam
                <strong>dua hari kerja</strong>{{ contactSummary }}.
              </p>
              <router-link to="/projects" class="btn done-btn">Lihat karya kami</router-link>
            </div>

            <!-- Steps -->
            <template v-else>
              <EnquiryProgress :steps="STEP_LABELS" :current="stepIndex" />

              <Transition :name="transitionName" mode="out-in" @after-enter="focusHeading">
                <div :key="stepIndex" class="step">
                  <h2 ref="stepHeading" tabindex="-1" class="step-prompt">{{ PROMPTS[stepIndex] }}</h2>
                  <p class="step-optional" v-if="stepIndex > 0">Isi yang Anda tahu, belum lengkap pun tidak mengapa.</p>

                  <!-- STEP 1 · Kontak -->
                  <div v-if="stepIndex === 0" class="fields">
                    <div class="field">
                      <label class="ps-label" for="nama">Nama Anda</label>
                      <input id="nama" v-model="answers.nama" type="text" autocomplete="name"
                             :aria-invalid="!!errors.nama" aria-describedby="nama-err" :disabled="sending" />
                      <p v-if="errors.nama" id="nama-err" class="field-err" role="alert">{{ errors.nama }}</p>
                    </div>

                    <div class="field">
                      <span class="ps-label">Cara terbaik menghubungi Anda</span>
                      <SegmentedCards v-model="answers.preferredChannel" name="channel"
                                      legend="Cara terbaik menghubungi Anda" :options="CHANNEL_OPTIONS" compact />
                    </div>

                    <div class="field-row">
                      <div class="field">
                        <label class="ps-label" for="wa">Nomor WhatsApp</label>
                        <input id="wa" v-model="answers.whatsapp" type="tel" inputmode="tel" autocomplete="tel"
                               placeholder="+62 8xx xxxx xxxx" :disabled="sending" />
                      </div>
                      <div class="field">
                        <label class="ps-label" for="email">Alamat email</label>
                        <input id="email" v-model="answers.email" type="email" inputmode="email" autocomplete="email"
                               :aria-invalid="!!errors.email" aria-describedby="email-err" :disabled="sending" />
                        <p v-if="errors.email" id="email-err" class="field-err" role="alert">{{ errors.email }}</p>
                      </div>
                    </div>
                    <p v-if="errors.contact" class="field-err" role="alert">{{ errors.contact }}</p>
                  </div>

                  <!-- STEP 2 · Tentang proyek -->
                  <div v-else-if="stepIndex === 1" class="fields">
                    <div class="field">
                      <span class="ps-label">Lingkup yang Anda butuhkan</span>
                      <SegmentedCards v-model="answers.scope" name="scope" legend="Lingkup" :options="SCOPE_OPTIONS" />
                    </div>
                    <div class="field">
                      <span class="ps-label">Jenis pekerjaan</span>
                      <SegmentedCards v-model="answers.workType" name="work" legend="Jenis pekerjaan" :options="WORK_OPTIONS" />
                    </div>
                    <div class="field-row">
                      <div class="field">
                        <label class="ps-label" for="lw">Lebar lahan (m)</label>
                        <input id="lw" v-model="answers.landWidth" type="text" inputmode="decimal" placeholder="mis. 10" :disabled="sending" />
                      </div>
                      <div class="field">
                        <label class="ps-label" for="ll">Panjang lahan (m)</label>
                        <input id="ll" v-model="answers.landLength" type="text" inputmode="decimal" placeholder="mis. 18" :disabled="sending" />
                      </div>
                    </div>
                    <p v-if="landText" class="field-hint">Luas lahan ≈ {{ landText }}</p>
                    <div class="field">
                      <label class="ps-label" for="loc">Lokasi lahan</label>
                      <input id="loc" v-model="answers.location" type="text" placeholder="mis. Bintaro, Tangerang Selatan" :disabled="sending" />
                    </div>
                    <div class="field">
                      <span class="ps-label">Rencana jumlah lantai</span>
                      <SegmentedCards v-model="answers.floors" name="floors" legend="Jumlah lantai" :options="FLOOR_OPTIONS" compact />
                    </div>
                  </div>

                  <!-- STEP 3 · Penghuni & ruang -->
                  <div v-else-if="stepIndex === 2" class="fields">
                    <div class="field">
                      <label class="ps-label" for="occ">Siapa yang akan tinggal atau menggunakan ruang ini?</label>
                      <textarea id="occ" v-model="answers.occupants" rows="3"
                                placeholder="mis. keluarga dengan dua anak, orang tua yang sesekali menginap, dan seekor anjing." :disabled="sending"></textarea>
                    </div>
                    <div class="field">
                      <span class="ps-label">Ruang apa saja yang dibutuhkan?</span>
                      <ChipMultiSelect v-model="answers.rooms" :options="ROOM_OPTIONS" legend="Ruang yang dibutuhkan"
                                       add-placeholder="Tambah ruang lain…" />
                    </div>
                  </div>

                  <!-- STEP 4 · Rumah yang dibayangkan -->
                  <div v-else-if="stepIndex === 3" class="fields">
                    <div class="field">
                      <label class="ps-label" for="style">Gaya arsitektur yang Anda harapkan</label>
                      <textarea id="style" v-model="answers.styleText" rows="3"
                                placeholder="Ceritakan suasana, material, atau referensi yang Anda sukai." :disabled="sending"></textarea>
                    </div>

                    <div class="field">
                      <span class="ps-label">Tautan inspirasi (Pinterest, Instagram, Drive)</span>
                      <div v-for="(_, i) in answers.inspirationLinks" :key="i" class="link-row">
                        <input v-model="answers.inspirationLinks[i]" type="url" inputmode="url"
                               placeholder="https://…" :disabled="sending" />
                        <button type="button" class="link-x" aria-label="Hapus tautan" @click="removeLink(i)">×</button>
                      </div>
                      <button v-if="answers.inspirationLinks.length < 6" type="button" class="link-add" @click="addLink">+ Tautan lain</button>
                    </div>

                    <div class="field">
                      <span class="ps-label">Unggah foto inspirasi</span>
                      <ImageUploader :images="images" :max="MAX_FILES" @add="addFiles" @remove="remove" @retry="retry" />
                    </div>

                    <div class="field">
                      <span class="ps-label">Perkiraan anggaran konstruksi</span>
                      <SegmentedCards v-model="answers.budget" name="budget" legend="Perkiraan anggaran" :options="BUDGET_OPTIONS" />
                      <p class="field-hint fee-hint">
                        Fee desain kami dihitung dari <strong>persentase perkiraan biaya konstruksi</strong>
                        (acuan IAI Kategori 3), bukan paket tetap. Angka ini hanya membantu kami memahami skala proyek.
                        <a href="#panduan-fee" class="cta fee-hint-link" @click="closeToGuide">Lihat Panduan Fee</a>
                      </p>
                    </div>

                    <div class="field">
                      <span class="ps-label">Kapan Anda berencana mulai membangun?</span>
                      <SegmentedCards v-model="answers.startTime" name="start" legend="Rencana mulai" :options="START_OPTIONS" />
                    </div>
                  </div>

                  <!-- STEP 5 · Tinjau & kirim -->
                  <div v-else class="fields">
                    <div v-for="g in reviewGroups" :key="g.step" class="review-group">
                      <div class="review-head">
                        <span class="ps-label">{{ g.title }}</span>
                        <button type="button" class="review-edit" @click="goto(g.step)">Ubah</button>
                      </div>
                      <dl class="review-list">
                        <template v-for="row in g.rows" :key="row[0]">
                          <div v-if="row[1]" class="review-row">
                            <dt>{{ row[0] }}</dt>
                            <dd>{{ row[1] }}</dd>
                          </div>
                        </template>
                        <p v-if="!g.rows.some((r) => r[1])" class="review-empty">Belum diisi</p>
                      </dl>
                    </div>

                    <div class="field">
                      <label class="ps-label" for="notes">Catatan tambahan (opsional)</label>
                      <textarea id="notes" v-model="answers.notes" rows="2"
                                placeholder="Hal lain yang ingin Anda sampaikan." :disabled="sending"></textarea>
                    </div>

                    <p class="consent">Dengan mengirim, Anda setuju kami menghubungi Anda mengenai enquiry ini.</p>
                    <p v-if="status === 'error'" class="field-err" role="alert">
                      {{ errorMsg || 'Terjadi kesalahan saat mengirim. Silakan coba lagi, atau hubungi kami di +62 812 1832 1775.' }}
                    </p>
                  </div>
                </div>
              </Transition>

              <!-- Honeypot -->
              <div class="hp-field" aria-hidden="true">
                <label for="website">Website</label>
                <input id="website" v-model="answers.website" type="text" tabindex="-1" autocomplete="off" />
              </div>

              <!-- Nav -->
              <div class="wizard-nav">
                <button v-if="stepIndex > 0" type="button" class="nav-back" :disabled="sending" @click="back">Kembali</button>
                <span class="nav-spacer"></span>
                <button v-if="stepIndex < LAST" type="button" class="btn nav-next" @click="next">Lanjut</button>
                <button v-else type="button" class="btn nav-send" :disabled="sending" @click="submit">
                  {{ sending ? 'Mengirim…' : 'Kirim enquiry' }}
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </section>

    <FeeGuide />
  </main>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import EnquirySidePanel from '../components/enquiry/EnquirySidePanel.vue'
import EnquiryProgress from '../components/enquiry/EnquiryProgress.vue'
import SegmentedCards from '../components/enquiry/SegmentedCards.vue'
import ChipMultiSelect from '../components/enquiry/ChipMultiSelect.vue'
import ImageUploader from '../components/enquiry/ImageUploader.vue'
import FeeGuide from '../components/enquiry/FeeGuide.vue'
import { useEnquiryForm, SCOPE_OPTIONS, WORK_OPTIONS, FLOOR_OPTIONS, BUDGET_OPTIONS, START_OPTIONS, ROOM_OPTIONS, labelOf } from '../composables/useEnquiryForm'
import { useEnquiryDraft } from '../composables/useEnquiryDraft'
import { useImageUpload } from '../composables/useImageUpload'
import { trackEvent } from '../utils/analytics'

const STEP_LABELS = ['Kontak', 'Proyek', 'Ruang', 'Gaya', 'Kirim']
const PROMPTS = [
  'Dengan siapa kami akan berbincang?',
  'Ceritakan tentang proyek Anda.',
  'Siapa yang akan menghuni rumah ini?',
  'Gambaran rumah impian Anda.',
  'Tinjau kembali sebelum mengirim.',
]
const REASSURE = [
  '',
  'Jika Anda belum yakin, tidak masalah, isi yang Anda tahu saja.',
  'Sebutkan ruang-ruang yang sudah terpikirkan; sisanya bisa kita susun bersama.',
  'Boleh diceritakan, boleh lewat tautan, boleh unggah foto referensi.',
  'Sekali kirim, kami membalas dalam dua hari kerja.',
]
const CHANNEL_OPTIONS = [{ value: 'whatsapp', label: 'WhatsApp' }, { value: 'email', label: 'Email' }]
const LAST = STEP_LABELS.length - 1

// Composables
const form = useEnquiryForm()
const { answers, errors } = form
const draft = useEnquiryDraft()
const draftId = draft.draftId
const { images, addFiles, retry, remove, doneImages, serialize, hydrate, cleanup, MAX_FILES } = useImageUpload(draftId, { onChange: scheduleSave })

// UI state
const stepIndex = ref(0)
const direction = ref(1)
const sending = ref(false)
const status = ref('')
const errorMsg = ref('')
const restoredBanner = ref(false)
const stepHeading = ref(null)

const transitionName = computed(() => (direction.value >= 0 ? 'step-fwd' : 'step-back'))
const firstName = computed(() => (answers.nama || '').trim().split(/\s+/)[0] || '')
const landText = computed(() => {
  const w = answers.landWidth, l = answers.landLength
  if (w && l) { const a = form.areaM2(); return `${w} × ${l} m${a ? ` (${a} m²)` : ''}` }
  if (w || l) return `${w || '?'} × ${l || '?'} m`
  return ''
})
const contactSummary = computed(() => {
  if (answers.preferredChannel === 'email' && answers.email) return ` lewat email`
  if (answers.whatsapp) return ` lewat WhatsApp`
  if (answers.email) return ` lewat email`
  return ''
})

const reviewGroups = computed(() => [
  { step: 0, title: 'Kontak', rows: [
    ['Nama', answers.nama],
    ['Kontak pilihan', answers.preferredChannel === 'email' ? 'Email' : 'WhatsApp'],
    ['WhatsApp', answers.whatsapp],
    ['Email', answers.email],
  ] },
  { step: 1, title: 'Proyek', rows: [
    ['Lingkup', labelOf(SCOPE_OPTIONS, answers.scope)],
    ['Jenis pekerjaan', labelOf(WORK_OPTIONS, answers.workType)],
    ['Ukuran lahan', landText.value],
    ['Lokasi', answers.location],
    ['Jumlah lantai', labelOf(FLOOR_OPTIONS, answers.floors)],
  ] },
  { step: 2, title: 'Penghuni & ruang', rows: [
    ['Penghuni', answers.occupants],
    ['Ruang', answers.rooms.join(', ')],
  ] },
  { step: 3, title: 'Gaya & anggaran', rows: [
    ['Gaya', answers.styleText],
    ['Tautan inspirasi', answers.inspirationLinks.filter(Boolean).join(', ')],
    ['Foto', doneImages().length ? `${doneImages().length} foto` : ''],
    ['Anggaran', labelOf(BUDGET_OPTIONS, answers.budget)],
    ['Mulai', labelOf(START_OPTIONS, answers.startTime)],
  ] },
])

// --- Restore prior draft (synchronously, before first paint) ---
const prior = draft.restore()
if (prior) {
  if (prior.answers && typeof prior.answers === 'object') {
    for (const k of Object.keys(answers)) {
      if (k === 'website') continue
      if (k in prior.answers && prior.answers[k] != null) answers[k] = prior.answers[k]
    }
  }
  if (!answers.inspirationLinks || !answers.inspirationLinks.length) answers.inspirationLinks = ['']
  if (Array.isArray(prior.images)) hydrate(prior.images)
  if (typeof prior.stepIndex === 'number') stepIndex.value = Math.min(Math.max(0, prior.stepIndex), LAST)
  const hasContent = answers.nama || answers.whatsapp || answers.email || answers.scope || doneImages().length
  restoredBanner.value = !!hasContent
}

// --- Autosave + analytics funnel (GA4) ---
let saveTimer = null
let analyticsStarted = restoredBanner.value // a restored draft has already "started"
function snapshot() {
  const { website, ...rest } = answers
  return { stepIndex: stepIndex.value, answers: rest, images: serialize() }
}
function doSave() { draft.save(snapshot()) }
function scheduleSave() { clearTimeout(saveTimer); saveTimer = setTimeout(doSave, 400) }
function trackStep(i) { trackEvent('enquiry_step', { step: i + 1, step_name: STEP_LABELS[i] }) }
watch(answers, () => {
  scheduleSave()
  if (!analyticsStarted) { analyticsStarted = true; trackEvent('enquiry_started', {}) } // first real interaction
}, { deep: true })
watch(stepIndex, (i) => { scheduleSave(); trackStep(i) })

function flushSave() { clearTimeout(saveTimer); if (status.value !== 'success') doSave() }
onMounted(() => {
  trackStep(stepIndex.value) // first step reached (funnel entry)
  document.addEventListener('visibilitychange', onHide)
  window.addEventListener('pagehide', flushSave)
})
onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', onHide)
  window.removeEventListener('pagehide', flushSave)
  clearTimeout(saveTimer)
  cleanup()
})
function onHide() { if (document.visibilityState === 'hidden') flushSave() }

// --- Navigation ---
function next() {
  if (!form.validateStep(stepIndex.value)) { nextTick(focusFirstError); return }
  if (stepIndex.value < LAST) { direction.value = 1; stepIndex.value++ }
}
function back() { if (stepIndex.value > 0) { direction.value = -1; stepIndex.value-- } }
function goto(i) { direction.value = i > stepIndex.value ? 1 : -1; stepIndex.value = Math.min(Math.max(0, i), LAST) }

function focusHeading() { stepHeading.value?.focus() }
function focusFirstError() {
  const el = document.querySelector('.enquiry-sec [aria-invalid="true"], .enquiry-sec .field-err')
  if (el && typeof el.focus === 'function') el.focus()
  else document.querySelector('.enquiry-sec [role="alert"]')?.scrollIntoView({ block: 'center' })
}

// --- Inspiration links ---
function addLink() { if (answers.inspirationLinks.length < 6) answers.inspirationLinks.push('') }
function removeLink(i) {
  answers.inspirationLinks.splice(i, 1)
  if (!answers.inspirationLinks.length) answers.inspirationLinks.push('')
}
function closeToGuide() { /* anchor navigation handled by href; hook kept for future analytics */ }

// --- Reset ---
function resetAll() {
  draft.clear()
  cleanup()
  for (const k of Object.keys(answers)) {
    if (Array.isArray(answers[k])) answers[k] = k === 'inspirationLinks' ? [''] : []
    else answers[k] = k === 'preferredChannel' ? 'whatsapp' : ''
  }
  stepIndex.value = 0
  restoredBanner.value = false
}

// --- Submit ---
async function submit() {
  if (sending.value) return
  sending.value = true
  status.value = ''
  errorMsg.value = ''
  try {
    const payload = form.buildPayload(draftId, doneImages())
    const res = await fetch('/api/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data.ok) throw new Error(data.error || `Gagal mengirim (${res.status})`)
    trackEvent('enquiry_submitted', {
      scope: answers.scope || '', work_type: answers.workType || '',
      budget_range: answers.budget || 'unknown', image_count: doneImages().length, has_images: doneImages().length > 0,
    })
    status.value = 'success'
    restoredBanner.value = false
    draft.clear()
    clearTimeout(saveTimer)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (err) {
    status.value = 'error'
    errorMsg.value = err?.message || ''
  } finally {
    sending.value = false
  }
}
</script>

<style lang="scss" scoped>
.enquiry-sec { padding-top: 128px; padding-bottom: var(--section-y); @media (max-width: 900px) { padding-top: 96px; } }

.enquiry-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr);
  gap: var(--gap-col);
  align-items: stretch;

  @media (max-width: 900px) { grid-template-columns: 1fr; gap: 26px; }
}

/* Wizard column */
.wizard { min-width: 0; display: flex; flex-direction: column; }

.restore-note {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  padding: 12px 16px;
  margin-bottom: 22px;
  background: var(--accent-quiet);
  border: var(--border-soft);
  font: var(--weight-regular) 13.5px/1.5 var(--font-ui);
  color: var(--ink-soft);
}
.restore-reset { border: 0; background: none; cursor: pointer; text-decoration: underline; color: var(--ink); font: inherit; }

/* Step */
.step { min-height: 320px; }
.step-prompt {
  font: var(--weight-light) clamp(24px, 3.4vw, 34px)/1.2 var(--font-editorial);
  color: var(--ink);
  letter-spacing: 0.01em;
  outline: none;
}
.step-optional { margin-top: 8px; font: var(--weight-regular) 13.5px/1.5 var(--font-ui); color: var(--ink-label); }

.fields { display: flex; flex-direction: column; gap: 24px; margin-top: 26px; }
.field { display: flex; flex-direction: column; }
.field > .ps-label, .field > label { margin-bottom: 12px; font-size: 11px; }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; @media (max-width: 520px) { grid-template-columns: 1fr; } }

.field input[type="text"], .field input[type="email"], .field input[type="tel"], .field input[type="url"], .field textarea {
  width: 100%;
  background: var(--ground-alt);
  border: 1px solid var(--rule);
  font: var(--weight-regular) var(--t-lead)/1.5 var(--font-ui);
  color: var(--ink);
  padding: 13px 15px;
  transition: border-color var(--dur) var(--ease), background var(--dur) var(--ease);
}
.field input::placeholder, .field textarea::placeholder { color: var(--neutral-warm-grey); }
.field input { min-height: 52px; }
.field textarea { resize: vertical; min-height: 104px; }
.field input:hover, .field textarea:hover { border-color: var(--rule-strong); }
.field input:focus, .field textarea:focus { outline: none; background: var(--neutral-white); border-color: var(--accent); }
.field input[aria-invalid="true"] { border-color: var(--pink-dark-rose); background: #fbf4f4; }

.field-hint { margin-top: 10px; font: var(--weight-regular) 13px/1.6 var(--font-ui); color: var(--ink-label); }
.field-err { margin-top: 8px; font: var(--weight-regular) 13px/1.5 var(--font-ui); color: var(--pink-dark-rose); }
.fee-hint { max-width: 62ch; strong { color: var(--ink); font-weight: var(--weight-medium); } }
.fee-hint-link { margin-left: 6px; }

/* Inspiration links */
.link-row { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.link-row input { flex: 1; }
.link-x { flex: none; width: 30px; height: 30px; border: 0; background: none; cursor: pointer; color: var(--ink-label); font-size: 20px; line-height: 1; }
.link-x:hover { color: var(--ink); }
.link-add { align-self: flex-start; margin-top: 4px; border: 0; background: none; cursor: pointer; color: var(--ink); font: var(--weight-medium) 12px/1 var(--font-ui); letter-spacing: var(--track-caps); text-transform: uppercase; }

/* Review */
.review-group { padding-bottom: 20px; border-bottom: var(--border-soft); }
.review-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.review-edit { border: 0; background: none; cursor: pointer; color: var(--ink); font: var(--weight-medium) 11px/1 var(--font-ui); letter-spacing: var(--track-caps); text-transform: uppercase; text-decoration: underline; }
.review-list { display: flex; flex-direction: column; gap: 8px; }
.review-row { display: grid; grid-template-columns: minmax(120px, 34%) 1fr; gap: 14px; }
.review-row dt { font: var(--weight-regular) 13px/1.5 var(--font-ui); color: var(--ink-label); }
.review-row dd { font: var(--weight-regular) 14.5px/1.5 var(--font-ui); color: var(--ink); word-break: break-word; }
.review-empty { font: var(--weight-regular) 13.5px/1.5 var(--font-ui); color: var(--neutral-warm-grey); font-style: italic; }
.consent { font: var(--weight-regular) 12.5px/1.6 var(--font-ui); color: var(--ink-label); }

/* Honeypot */
.hp-field { position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden; }

/* Nav */
.wizard-nav { display: flex; align-items: center; gap: 16px; margin-top: 34px; padding-top: 24px; border-top: var(--border-soft); }
.nav-spacer { flex: 1; }
.nav-back { border: 0; background: none; cursor: pointer; color: var(--ink); font: var(--weight-medium) 11.5px/1 var(--font-ui); letter-spacing: var(--track-caps); text-transform: uppercase; }
.nav-back:hover { font-weight: 700; }
.nav-next, .nav-send { min-width: 160px; }
.nav-send[disabled] { opacity: 0.6; cursor: not-allowed; }

/* Success */
.done { padding: 20px 0 30px; }
.done-eyebrow { color: var(--ink-label); }
.done-head { margin-top: 12px; }
.done-body { margin-top: 18px; strong { color: var(--ink); font-weight: var(--weight-medium); } }
.done-btn { margin-top: 30px; }

/* Step transitions (honor reduced-motion via --dur token collapse) */
.step-fwd-enter-active, .step-fwd-leave-active,
.step-back-enter-active, .step-back-leave-active { transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease); }
.step-fwd-enter-from { opacity: 0; transform: translateX(14px); }
.step-fwd-leave-to { opacity: 0; transform: translateX(-14px); }
.step-back-enter-from { opacity: 0; transform: translateX(-14px); }
.step-back-leave-to { opacity: 0; transform: translateX(14px); }
@media (prefers-reduced-motion: reduce) {
  .step-fwd-enter-from, .step-fwd-leave-to, .step-back-enter-from, .step-back-leave-to { transform: none; }
}
</style>
