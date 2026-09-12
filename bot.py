"""
🤖 ربات تلگرام مینی‌گیم خفن
نصب:  pip install aiogram
اجرا:  python bot.py
توکن‌ها امن داخل فایل .env هستن (هیچ‌وقت کامیت/پخش نشن!)
"""
import asyncio, os

def load_env(path=".env"):
    try:
        with open(path, encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))
    except FileNotFoundError:
        pass
load_env(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"))

from aiogram import Bot, Dispatcher, F
from aiogram.types import Message, InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from aiogram.filters import Command

BOT_TOKEN = os.getenv("BOT_TOKEN", "")
if not BOT_TOKEN:
    raise SystemExit("❌ BOT_TOKEN پیدا نشد! توکن ربات رو بذار تو فایل .env (کنار bot.py)")
WEBAPP_URL = os.getenv("WEBAPP_URL", "https://your-domain.com/mini-game.html")

bot = Bot(BOT_TOKEN)
dp = Dispatcher()

def menu_kb():
    return InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="🎮 باز کردن شهربازی", web_app=WebAppInfo(url=WEBAPP_URL))],
        [InlineKeyboardButton(text="🃏 کاشی", callback_data="g"),
         InlineKeyboardButton(text="🎲 منچ", callback_data="g")],
        [InlineKeyboardButton(text="🔢 سودوکو", callback_data="g"),
         InlineKeyboardButton(text="💣 مین‌روب", callback_data="g")],
    ])

@dp.message(Command("start"))
async def start(m: Message):
    await m.answer(
        f"سلام {m.from_user.first_name} عزیز! 🎉\n\n"
        "به <b>مینی‌گیم خفن</b> خوش اومدی! 🚀\n"
        "۱۸ تا بازی جذاب واست آماده‌ست! 🎉\n"
        "🃏 کاشی • 🎲 منچ • ♟️ شطرنج • 🔢 سودوکو • 💣 مین‌روب • ✊ سنگ کاغذ قیچی\n"
        "❓ کوییز • 🦕 دایی ناصر • 🔢 2048 • ❌ دوز • 🍬 آبنبات • 🐍 مار و پله • 🚩 حدس پرچم • 🐱 حاج عبدالله\n"
        "🏗️ تاور استک • 🧊 آیس اسلاید • 🚗 اسکیپ • 🟣 بال‌ران\n\n"
        "👇 بزن و بازی کن!",
        parse_mode="HTML", reply_markup=menu_kb()
    )

@dp.message(Command("games"))
async def games(m: Message):
    await m.answer("🎮 انتخاب کن و بترکون! 🔥", reply_markup=menu_kb())

@dp.message(Command("help"))
async def help_cmd(m: Message):
    await m.answer("📖 کافیه /start رو بزنی و دکمه «باز کردن شهربازی» رو لمس کنی! همه بازی‌ها راهنما و درجه سختی دارن 😊")

async def main():
    print("🤖 ربات روشن شد...")
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
