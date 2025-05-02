from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ApplicationBuilder, CommandHandler, CallbackContext

# Токен вашего бота
BOT_TOKEN = "7769726208:AAFY4t2VgxNpcBE56kDHX1VzYW8hgUnV6-U"

async def start(update: Update, context: CallbackContext):
    """Обработчик команды /start"""
    keyboard = [
        [InlineKeyboardButton("Открыть Mini App", url="https://example.com")]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)

    await update.message.reply_text(
        "Добро пожаловать в Mini App! Нажмите на кнопку ниже, чтобы открыть приложение.",
        reply_markup=reply_markup
    )

if __name__ == "__main__":
    app = ApplicationBuilder().token(BOT_TOKEN).build()

    app.add_handler(CommandHandler("start", start))

    print("Бот запущен!")
    app.run_polling()