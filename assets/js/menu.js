(() => {
  const data = window.FI_MENU_DATA;
  const mount = document.querySelector('[data-menu-app]');
  if (!data || !mount) return;

  const tabs = document.querySelector('[data-menu-tabs]');
  const controls = document.querySelector('[data-menu-controls]');
  let active = location.hash.replace('#','');
  if (!data[active]) active = 'dinner';

  const itemMarkup = item => {
    if (item.heading) return `<h4 class="menu-subgroup">${item.heading}</h4>`;
    return `<article class="menu-item">
      <div class="menu-item-name">${item.name}</div>
      ${item.price ? `<div class="menu-item-price">${item.price}</div>` : ''}
      ${item.desc ? `<p class="menu-item-desc">${item.desc}${item.note ? `<span class="menu-item-note">${item.note}</span>` : ''}</p>` : item.note ? `<p class="menu-item-desc"><span class="menu-item-note">${item.note}</span></p>` : ''}
    </article>`;
  };

  const categoryMarkup = (category, index) => `
    <section class="menu-category ${category.open ? 'open' : ''}">
      <button class="menu-category-button" type="button" aria-expanded="${category.open ? 'true' : 'false'}">
        <span class="menu-category-title"><span>${category.title}</span><small>${category.note || `${category.items.length} selections`}</small></span>
        <span class="menu-plus" aria-hidden="true"></span>
      </button>
      <div class="menu-category-content">
        <div class="menu-category-inner"><div class="menu-items">${category.items.map(itemMarkup).join('')}</div></div>
      </div>
    </section>`;

  function renderTabs() {
    tabs.innerHTML = Object.entries(data).map(([key, menu]) => `<button class="menu-tab ${key === active ? 'active' : ''}" type="button" data-tab="${key}" aria-selected="${key === active}">${menu.label}</button>`).join('');
    tabs.querySelectorAll('.menu-tab').forEach(button => button.addEventListener('click', () => {
      active = button.dataset.tab;
      history.replaceState(null, '', `#${active}`);
      render();
      document.querySelector('.menu-shell')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));
  }

  function render() {
    renderTabs();
    const menu = data[active];
    mount.innerHTML = `
      <div class="menu-tools">
        <div class="menu-intro">
          <p class="eyebrow">${menu.label} at Fire &amp; Ice</p>
          <h2 class="h2">Explore the full ${menu.label.toLowerCase()} menu.</h2>
          <p class="lede">${menu.intro}</p>
        </div>
        <div class="menu-controls" data-menu-controls>
          <button class="menu-control" type="button" data-expand>Expand all</button>
          <button class="menu-control" type="button" data-collapse>Collapse all</button>
        </div>
      </div>
      <div class="menu-panel active">${menu.categories.map(categoryMarkup).join('')}</div>
      <p class="menu-disclaimer">${menu.disclaimer}</p>`;

    const categories = [...mount.querySelectorAll('.menu-category')];
    categories.forEach(category => {
      const button = category.querySelector('.menu-category-button');
      button.addEventListener('click', () => {
        const open = category.classList.toggle('open');
        button.setAttribute('aria-expanded', String(open));
      });
    });
    mount.querySelector('[data-expand]').addEventListener('click', () => categories.forEach(category => {
      category.classList.add('open'); category.querySelector('button').setAttribute('aria-expanded','true');
    }));
    mount.querySelector('[data-collapse]').addEventListener('click', () => categories.forEach(category => {
      category.classList.remove('open'); category.querySelector('button').setAttribute('aria-expanded','false');
    }));
  }

  render();
})();
