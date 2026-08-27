<template>
  <section class="section" id="studio">
    <div class="container">
      <div class="split ps-reveal studio-split">
        <div class="studio-media">
          <img src="/images/projects/grey/10.jpg?v=1" alt="Poiesis Studio — Grey project" loading="lazy" />
        </div>
        <div class="studio-body">
          <p class="ps-label">The studio</p>
          <h2 class="ps-h1 studio-head">We listen first, then we build.</h2>
          <p class="ps-body studio-p">
            Poiesis Studio is a Jakarta-based architecture &amp; interior design consultancy
            founded by Ar. Amita Ratih Purnamasari (Mayang) as Principal and Jessica Sarana
            as Partner. Before any spatial program or aesthetic form is designed, a
            foundational story must be established.
          </p>
          <p class="ps-body studio-p">
            Applied through a phenomenological understanding of the user's experience, the
            result is architecture &amp; interior design with a profound connection to its
            context, function, and most importantly to the people it serves.
          </p>
          <div class="studio-stats">
            <div><span class="stat-n">24</span><span class="ps-label stat-l">Built projects</span></div>
            <div><span class="stat-n">20</span><span class="ps-label stat-l">Design projects</span></div>
            <div><span class="stat-n">IAI</span><span class="ps-label stat-l">Certified principal</span></div>
          </div>
          <p class="studio-cta"><router-link to="/about" class="cta">About the studio</router-link></p>
          <a href="https://instagram.com/poiesis.id" target="_blank" rel="noopener" class="studio-ig" aria-label="Poiesis on Instagram">
            <i class="pi pi-instagram studio-ig-icon"></i>
            <span class="studio-ig-handle">@poiesis.id</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style lang="scss" scoped>
.studio-split { align-items: start; }
.studio-media img { width: 100%; aspect-ratio: 1 / 1; object-fit: cover; }
.studio-head { margin-top: 14px; }
.studio-p { margin-top: 22px; }
.studio-p + .studio-p { margin-top: 1em; }

.studio-stats {
  display: flex;
  gap: 44px;
  margin-top: 34px;
  padding-top: 22px;
  border-top: var(--border-hairline);

  div { display: flex; flex-direction: column; }
}
.stat-n { font: var(--weight-light) 32px/1 var(--font-ui); margin-bottom: 6px; color: var(--ink); }
.stat-l { font-size: 11px; }

.studio-cta { margin-top: 28px; }

.studio-ig {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-top: 18px;
  text-decoration: none;
  transition: opacity var(--transition-hover);

  &:hover { opacity: 0.75; }
}
.studio-ig-icon {
  font-size: 18px;
  line-height: 1;
  background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.studio-ig-handle { font: var(--weight-medium) 14px/1 var(--font-ui); color: var(--ink); }

@media (max-width: 640px) {
  .studio-stats { gap: 28px; }
}
</style>
