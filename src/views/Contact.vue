<template>
  <main>
    <section class="section contact-sec">
      <div class="container">
        <div class="contact-grid ps-reveal">
          <!-- Dark panel -->
          <div class="contact-panel">
            <span class="panel-scrim" aria-hidden="true"></span>
            <div class="panel-top">
              <p class="ps-label panel-eyebrow">Contact</p>
              <p class="ps-h2 panel-head">A project?<br>Let's begin with the story.</p>
            </div>
            <div class="panel-bottom">
              <span>Jakarta, Indonesia<br>PT. Pencipta Organik Imaji</span>
              <span>Calamus C7-35, Citra Garden Bintaro<br>Ciputat, Tangerang Selatan 15413</span>
              <a href="tel:+6281218321775" class="panel-strong">+62 812 1832 1775</a>
              <a href="https://instagram.com/poiesis.id" target="_blank" rel="noopener">@poiesis.id</a>
              <span>Monday – Friday · 09.00–18.00 WIB</span>
            </div>
          </div>

          <!-- Form -->
          <form class="contact-form" @submit.prevent="handleSubmit">
            <p class="ps-body form-intro">Before we sketch a single line, we want to hear your story. Tell us where the site is, who it's for, and what it must do.</p>

            <div class="field">
              <label class="ps-label" for="name">Full name</label>
              <input id="name" v-model="form.name" type="text" required :disabled="sending" />
            </div>
            <div class="field-row">
              <div class="field">
                <label class="ps-label" for="email">Email</label>
                <input id="email" v-model="form.email" type="email" required :disabled="sending" />
              </div>
              <div class="field">
                <label class="ps-label" for="phone">Phone / WhatsApp</label>
                <input id="phone" v-model="form.phone" type="tel" :disabled="sending" />
              </div>
            </div>
            <div class="field">
              <label class="ps-label" for="message">Where is the site, who is it for, what must it do?</label>
              <textarea id="message" v-model="form.message" rows="4" required :disabled="sending"></textarea>
            </div>

            <div class="hp-field" aria-hidden="true">
              <label for="website">Website</label>
              <input id="website" v-model="form.website" type="text" tabindex="-1" autocomplete="off" />
            </div>

            <div class="form-actions">
              <span class="form-reply">We reply within two working days.</span>
              <button type="submit" class="btn form-submit" :disabled="sending">
                {{ sending ? 'Sending…' : 'Send enquiry' }}
              </button>
            </div>

            <p v-if="status === 'success'" class="form-status success">
              Thank you — your message has been sent. We'll be in touch within two working days.
            </p>
            <p v-if="status === 'error'" class="form-status error">
              {{ errorMsg || 'Something went wrong. Please try again, or reach us on +62 812 1832 1775.' }}
            </p>
          </form>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue'

const form = reactive({ name: '', email: '', phone: '', message: '', website: '' })
const sending = ref(false)
const status = ref('')
const errorMsg = ref('')

async function handleSubmit() {
  if (sending.value) return
  sending.value = true
  status.value = ''
  errorMsg.value = ''
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name, email: form.email, phone: form.phone,
        message: form.message, website: form.website,
      }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data.ok) throw new Error(data.error || `Request failed (${res.status})`)
    status.value = 'success'
    form.name = ''; form.email = ''; form.phone = ''; form.message = ''
  } catch (err) {
    status.value = 'error'
    errorMsg.value = err?.message || ''
  } finally {
    sending.value = false
  }
}
</script>

<style lang="scss" scoped>
.contact-sec { padding-top: 140px; }

.contact-grid {
  display: grid;
  grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr);
  gap: var(--gap-col);
  align-items: stretch;

  @media (max-width: 900px) { grid-template-columns: 1fr; gap: 40px; }
}

/* Dark panel */
.contact-panel {
  position: relative;
  min-height: 520px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  background: var(--stripe-dark);
}
.panel-scrim { position: absolute; inset: 0; background: var(--scrim-flat); }
.panel-top { position: relative; padding: 38px; }
.panel-eyebrow { color: rgba(255,255,255,.78); }
.panel-head { color: #fff; margin-top: 12px; }
.panel-bottom {
  position: relative;
  padding: 38px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  font: var(--weight-regular) 15px/1.6 var(--font-ui);
  color: var(--nat-cream);
}
.panel-bottom a { color: var(--nat-cream); transition: color var(--transition-hover); }
.panel-bottom a:hover { color: var(--pink-soft); }
.panel-strong { font-weight: 500; }

/* Form */
.contact-form { display: flex; flex-direction: column; gap: 26px; }
.form-intro { margin-bottom: 4px; }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 26px; @media (max-width: 520px) { grid-template-columns: 1fr; } }
.field { display: flex; flex-direction: column; }
.field label { font-size: 11px; margin-bottom: 8px; }
.field input, .field textarea {
  width: 100%;
  background: transparent;
  border: 0;
  border-bottom: var(--border-field);
  font: var(--weight-medium) var(--t-lead)/1.5 var(--font-ui);
  color: var(--ink);
  padding: 4px 0 9px;
  transition: border-color var(--transition-hover);
}
.field input { min-height: 44px; }
.field textarea { resize: vertical; min-height: 96px; }
.field input:focus, .field textarea:focus { outline: none; border-bottom-color: var(--accent); }

.hp-field { position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden; }

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}
.form-reply { font: var(--weight-regular) 13px/1.6 var(--font-ui); color: var(--ink-label); }
.form-submit { background: var(--neutral-charcoal); border-color: var(--neutral-charcoal); }
.form-submit:hover { background: var(--accent-solid); border-color: var(--accent-solid); }
.form-submit[disabled] { opacity: .6; cursor: not-allowed; }

.form-status { font: var(--weight-regular) 14px/1.6 var(--font-ui); }
.form-status.success { color: #1a7f37; }
.form-status.error { color: var(--pink-crimson); }
</style>
