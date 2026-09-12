/* ===== کتابخانه آیکون‌های SVG (stroke حرفه‌ای) ===== */
const ICONS = {
gamepad:'<rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 11v3M5.5 12.5h3"/><circle cx="15.5" cy="11.5" r="1" fill="currentColor" stroke="none"/><circle cx="18" cy="14" r="1" fill="currentColor" stroke="none"/>',
target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/>',
user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5"/>',
sliders:'<path d="M4 7h9M17.5 7H20M4 17h3.5M12 17h8"/><circle cx="15.5" cy="7" r="2.3"/><circle cx="10" cy="17" r="2.3"/>',
coin:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/>',
bolt:'<path d="M13 2 4 14h6l-1 8 9-12h-6z"/>',
gift:'<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v9h14v-9M12 8v13M12 8S10.5 3.5 8 3.5 6 8 12 8zM12 8s1.5-4.5 4-4.5S18 8 12 8z"/>',
trophy:'<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 5.5H4.5A3.5 3.5 0 0 0 8 12M16 5.5h3.5A3.5 3.5 0 0 1 16 12M12 13v3M8.5 20h7M10 16h4"/>',
play:'<circle cx="12" cy="12" r="9"/><path d="M10 8.5l6 3.5-6 3.5z" fill="currentColor" stroke="none"/>',
back:'<path d="M5 12h14M13 6l6 6-6 6"/>',
help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.3a2.6 2.6 0 1 1 3.7 2.3c-.8.4-1.2 1-1.2 1.9"/><circle cx="12" cy="17" r="1.1" fill="currentColor" stroke="none"/>',
dice:'<rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="9" cy="9" r="1.1" fill="currentColor" stroke="none"/><circle cx="15" cy="9" r="1.1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none"/><circle cx="9" cy="15" r="1.1" fill="currentColor" stroke="none"/><circle cx="15" cy="15" r="1.1" fill="currentColor" stroke="none"/>',
crown:'<path d="M4 18.5h16M4 18.5 3 9l4.5 3L12 5.5 16.5 12 21 9l-1 9.5z"/>',
grid:'<rect x="4" y="4" width="16" height="16" rx="2.5"/><path d="M9.3 4v16M14.7 4v16M4 9.3h16M4 14.7h16"/>',
cards:'<rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M4 16V5.5A1.5 1.5 0 0 1 5.5 4H15"/><circle cx="14" cy="14" r="2.2"/>',
bomb:'<circle cx="11" cy="14" r="6.5"/><path d="M15.5 9.5 19 6M19 6c.3-1.7 1.3-2.7 3-3"/>',
scissors:'<circle cx="6" cy="7" r="2.6"/><circle cx="6" cy="17" r="2.6"/><path d="M8.2 8.8 20 19M8.2 15.2 20 5"/>',
star:'<path d="M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6-5.4-3-5.4 3 1.1-6L3.2 9.4l6.1-.8z"/>',
flame:'<path d="M12 3s5.5 4.6 5.5 9.5a5.5 5.5 0 0 1-11 0C6.5 9 9 7 9.5 5c1 1.5 2 2 2 2C11 5 11.5 4 12 3z"/>',
moon:'<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z"/>',
sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8"/>',
auto:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>',
font:'<path d="M4 18.5V7a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v11.5M9 18.5h6M12 6v12.5"/>',
sound:'<path d="M4 10v4h3l4 4V6l-4 4z"/><path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.8a7.5 7.5 0 0 1 0 10.4"/>',
vibrate:'<rect x="8.5" y="3" width="7" height="18" rx="2"/><path d="M12 18h.01M4.5 9.5 3 12l1.5 2.5M19.5 9.5 21 12l-1.5 2.5"/>',
party:'<path d="M5 19 14 10M13.5 10.5l-4-4 5.5-3 3 5.5zM19 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>',
trash:'<path d="M4 7h16M9.5 7V5h5v2M6.5 7l.8 13h9.4l.8-13M10 11v6M14 11v6"/>',
shield:'<path d="M12 3l7 2.8v5.4c0 4.8-3 7.8-7 9.8-4-2-7-5-7-9.8V5.8z"/><path d="M9 12l2 2 4-4.5"/>',
history:'<path d="M3.5 12a8.5 8.5 0 1 1 2.5 6"/><path d="M3.5 12H7M3.5 12V8.5M12 8v4.5l3 1.8"/>',
chart:'<path d="M4 20h16M7 20v-6M12 20V6M17 20v-9"/>',
check:'<path d="M4 12.5l5 5L20 6.5"/>',
x:'<path d="M6 6l12 12M18 6 6 18"/>',
refresh:'<path d="M20 12a8 8 0 1 1-2.34-5.66M20 3.5V8h-4.5"/>',
home:'<path d="M4 11l8-7 8 7M6 9.5V20h12V9.5"/>',
warn:'<path d="M12 3.5 2.5 20h19z"/><path d="M12 9.5V14"/><circle cx="12" cy="16.8" r="1.1" fill="currentColor" stroke="none"/>',
eye:'<path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.6"/>',
eraser:'<path d="M5.5 15.5 13 8l6 6-4.5 4.5H9z"/><path d="M4 20.5h16"/>',
bulb:'<path d="M9.5 18h5M10.5 21h3M12 3a6 6 0 0 0-3.4 10.9c.8.6 1.4 1.2 1.4 2.1h4c0-.9.6-1.5 1.4-2.1A6 6 0 0 0 12 3z"/>',
search:'<circle cx="11" cy="11" r="6.5"/><path d="M15.8 15.8 20.5 20.5"/>',
flag:'<path d="M5.5 21.5V4M5.5 4.5H18l-2.5 3.8L18 12H5.5"/>',
cat:'<path d="M4 9.5L6.5 4.5L11 7.5h2L17.5 4.5L20 9.5V14a8 8 0 0 1-16 0z"/><circle cx="9.3" cy="12.5" r="1.1" fill="currentColor" stroke="none"/><circle cx="14.7" cy="12.5" r="1.1" fill="currentColor" stroke="none"/><path d="M12 15.2c-.8.8-2.2.8-3 0M12 15.2c.8.8 2.2.8 3 0"/>',
tower:'<path d="M7 20.5h10M5.5 16.5h13M8 12.5h8M6.5 8.5h11M9 4.5h6"/>',
snow:'<path d="M12 2.5v19M4.3 7.2l15.4 9.6M19.7 7.2L4.3 16.8M12 6.5l-1.8-1.8M12 6.5l1.8-1.8M12 17.5l-1.8 1.8M12 17.5l1.8 1.8"/>',
car:'<path d="M4 13l1.5-4.5A2 2 0 0 1 7.4 7h9.2a2 2 0 0 1 1.9 1.5L20 13"/><rect x="3" y="13" width="18" height="5" rx="1.5"/><circle cx="7.5" cy="18" r="1.6"/><circle cx="16.5" cy="18" r="1.6"/><path d="M6.5 15.5h2M15.5 15.5h2"/>',
ball:'<circle cx="14" cy="12" r="6"/><circle cx="12" cy="10" r="1.2" fill="currentColor" stroke="none"/><path d="M2.5 8.5h4M1.5 12h5M2.5 15.5h4"/>',
bot:'<rect x="5" y="9.5" width="14" height="10" rx="2.5"/><circle cx="9.5" cy="14" r="1.1" fill="currentColor" stroke="none"/><circle cx="14.5" cy="14" r="1.1" fill="currentColor" stroke="none"/><path d="M12 9.5V5.5M9.5 5.5h5"/>',
pointer:'<path d="M9 11.5V5.5a1.5 1.5 0 0 1 3 0v4.5m0-1a1.5 1.5 0 0 1 3 0V11m0-.5a1.5 1.5 0 0 1 3 0v3.5a6 6 0 0 1-6 6h-.8a6 6 0 0 1-4.7-2.3l-2.6-3.4a1.6 1.6 0 0 1 2.4-2z"/>',
heart:'<path d="M12 20.5S3.5 15.5 3.5 9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8.5 2.5c0 6-8.5 11-8.5 11z"/>',
medal:'<circle cx="12" cy="9" r="5.5"/><path d="M9 13.8 7 21l5-2.6L17 21l-2-7.2"/>',
sad:'<circle cx="12" cy="12" r="8.8"/><path d="M8.3 15.5c1-1.6 2.3-2.2 3.7-2.2s2.7.6 3.7 2.2"/><circle cx="9" cy="9.8" r="1.1" fill="currentColor" stroke="none"/><circle cx="15" cy="9.8" r="1.1" fill="currentColor" stroke="none"/>',
palette:'<circle cx="12" cy="12" r="8.5"/><circle cx="9" cy="10" r="1.3" fill="currentColor" stroke="none"/><circle cx="12.5" cy="7.8" r="1.3" fill="currentColor" stroke="none"/><circle cx="15.7" cy="10.5" r="1.3" fill="currentColor" stroke="none"/><circle cx="9.5" cy="14.8" r="1.3" fill="currentColor" stroke="none"/>',
info:'<circle cx="12" cy="12" r="8.8"/><path d="M12 11v5"/><circle cx="12" cy="8" r="1.1" fill="currentColor" stroke="none"/>',
calendar:'<rect x="4" y="5.5" width="16" height="15" rx="2.5"/><path d="M4 10.5h16M8.5 3v4M15.5 3v4"/>',
clock:'<circle cx="12" cy="12" r="8.8"/><path d="M12 7.5V12l3.2 2"/>',
bars1:'<rect x="4" y="15" width="4.5" height="5" rx="1.2" fill="currentColor" stroke="none"/><rect x="9.8" y="11" width="4.5" height="9" rx="1.2" fill="currentColor" stroke="none" opacity=".28"/><rect x="15.5" y="7" width="4.5" height="13" rx="1.2" fill="currentColor" stroke="none" opacity=".28"/>',
bars2:'<rect x="4" y="15" width="4.5" height="5" rx="1.2" fill="currentColor" stroke="none"/><rect x="9.8" y="11" width="4.5" height="9" rx="1.2" fill="currentColor" stroke="none"/><rect x="15.5" y="7" width="4.5" height="13" rx="1.2" fill="currentColor" stroke="none" opacity=".28"/>',
bars3:'<rect x="4" y="15" width="4.5" height="5" rx="1.2" fill="currentColor" stroke="none"/><rect x="9.8" y="11" width="4.5" height="9" rx="1.2" fill="currentColor" stroke="none"/><rect x="15.5" y="7" width="4.5" height="13" rx="1.2" fill="currentColor" stroke="none"/>',
lock:'<rect x="5" y="11" width="14" height="9.5" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
dino:'<path d="M4 20h4l1.2-4.5h4.6L15 20h5"/><path d="M9.5 15.5V9.5a3 3 0 0 1 6 0V12"/><circle cx="13.8" cy="8.6" r="1" fill="currentColor" stroke="none"/>',
quiz:'<path d="M4 4.5h16v10.5H9.5L4 19z"/><path d="M10 10.5a2 2 0 1 1 2.9 1.8c-.7.3-1 .8-1 1.5"/><circle cx="11.9" cy="15.8" r="1" fill="currentColor" stroke="none"/>',
tiles:'<rect x="4" y="4" width="7" height="7" rx="1.8"/><rect x="13" y="4" width="7" height="7" rx="1.8"/><rect x="4" y="13" width="7" height="7" rx="1.8"/><rect x="13" y="13" width="7" height="7" rx="1.8" fill="currentColor" stroke="none" opacity=".45"/>',
globe:'<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c3.2 3.6 3.2 13.4 0 17M12 3.5c-3.2 3.6-3.2 13.4 0 17"/>',
doz:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M7 7.5l2.5 2.5M9.5 7.5 7 10"/><circle cx="15" cy="15" r="2.4"/>',
candy:'<path d="M8.5 8.5 4 6v12zM15.5 8.5 20 6v12z"/><circle cx="12" cy="12" r="4.2"/><path d="M10 12h4"/>',
snake:'<path d="M4 19c6 0 5-5 10-5 3.5 0 4.5-2.5 4-5"/><circle cx="17.6" cy="7.6" r="1.8"/><path d="M19.5 6 21 4.5M19.5 6 18 4.5"/>',
grid2:'<rect x="4" y="4" width="7" height="7" rx="2.2" fill="currentColor" stroke="none"/><rect x="13" y="4" width="7" height="7" rx="2.2"/><rect x="4" y="13" width="7" height="7" rx="2.2"/><rect x="13" y="13" width="7" height="7" rx="2.2"/>',
bag:'<path d="M5.5 8h13l-1 12h-11z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
podium:'<rect x="3.5" y="11" width="5" height="9.5" rx="1"/><rect x="9.5" y="6" width="5" height="14.5" rx="1"/><rect x="15.5" y="13" width="5" height="7.5" rx="1"/>',
pack:'<rect x="6" y="5" width="12" height="15" rx="4"/><path d="M9.5 5V4a2.5 2.5 0 0 1 5 0v1"/><rect x="9" y="11" width="6" height="6" rx="2"/>',
up:'<circle cx="12" cy="12" r="8.8"/><path d="M12 16.5v-9M8 9.5l4-4 4 4"/>',
clover:'<circle cx="12" cy="7.5" r="2.8"/><circle cx="7.5" cy="12" r="2.8"/><circle cx="16.5" cy="12" r="2.8"/><path d="M12 13.5c0 3.5-1.5 5.5-4 6.5"/>',
magnet:'<path d="M5 5v6.5a7 7 0 0 0 14 0V5"/><path d="M5 8.5h4.5M14.5 8.5H19"/>'
};
function icon(name, size){
  size = size||22;
  return '<span class="ic"><svg width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+(ICONS[name]||ICONS.info)+'</svg></span>';
}
// جایگذاری خودکار در HTML ایستا: <span data-ic="coin" data-sz="18"></span>
function hydrateIcons(root){
  (root||document).querySelectorAll('[data-ic]').forEach(el=>{
    if(el.dataset.done) return; el.dataset.done='1';
    el.innerHTML = '<svg width="'+(el.dataset.sz||22)+'" height="'+(el.dataset.sz||22)+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+(ICONS[el.dataset.ic]||ICONS.info)+'</svg>';
    el.classList.add('ic');
  });
}
document.addEventListener('DOMContentLoaded',()=>hydrateIcons());
hydrateIcons();
