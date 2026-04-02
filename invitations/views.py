import json

from django.http import JsonResponse
from django.shortcuts import render
from django.utils.translation import gettext as _
from django.views.decorators.http import require_POST

from .models import RSVPSubmission


def translated_copy(request, en_text, uk_text):
    return uk_text if getattr(request, 'LANGUAGE_CODE', 'en').startswith('uk') else en_text


def HomePageView(request):
    context = {
        'home_story': translated_copy(
            request,
            """We met at our university camp in 2018 - we were finishing each other's
sentences, laughing way too much, and somehow already acting like we'd known each other for years. Also,
it turns out that being fed is, in fact, a very effective love language - and one of us was completely
won over.

Since then, we've been on countless adventures, collected a lot of memories (and probably did a few
questionable travel decisions), and eventually built a home together - which still feels a bit unreal
and very us.

And now, here we are, starting our next chapter.

Having you here means everything to us. Some of you witnessed the very beginning, others joined
somewhere along the way - but all of you are part of this story. We feel so lucky to celebrate it
together with you.""",
            """Ми познайомилися в університетському таборі у 2018 році - ми закінчували думки одне одного,
сміялися надто багато і вже поводилися так, ніби зналися багато років. І ще,
виявилося, що смачна їжа - це справді дуже сильна мова кохання, і одного з нас це остаточно
підкорило.

Відтоді ми пережили безліч пригод, зібрали багато спогадів (і, можливо, ухвалили кілька
сумнівних рішень щодо подорожей), а згодом побудували спільний дім - що досі здається трохи нереальним
і дуже нашим.

І ось ми тут, починаємо нашу нову главу.

Ваша присутність означає для нас дуже багато. Хтось із вас був поруч із самого початку, хтось приєднався
пізніше - але всі ви є частиною цієї історії. Нам неймовірно пощастило святкувати її
разом із вами.""",
        ),
    }
    return render(request, 'home.html', context)

def RSVPPageView(request):
    rsvp_translations = {
        'guest_label': _('Guest: %(name)s'),
        'saved_label': _('%(name)s, your RSVP is saved.'),
        'question_label': _('Question %(number)s'),
        'add_song': _('Add song'),
        'next': _('Next'),
        'no_music_requests': _('No music requests'),
        'submitting': _('Submitting...'),
        'submit_everything': _('Submit everything'),
        'submit_error': _('There was a problem saving your RSVP. Please try again.'),
        'questions': [
            {
                'key': 'attendance',
                'question': _('Are you going with us to the accommodation and party?'),
                'options': [
                    {'label': _('Yes'), 'value': 'yes_party'},
                    {'label': _('No, only the ceremony'), 'value': 'no_ceremony_only'},
                ],
            },
            {
                'key': 'driving',
                'question': _('Will you be driving?'),
                'options': [
                    {'label': _('Yes, but I cannot take anyone with me'), 'value': 'yes_no_space'},
                    {'label': _('Yes, and I can take someone else too'), 'value': 'yes_can_take_someone'},
                    {'label': _('No, I need a lift'), 'value': 'no_need_lift'},
                ],
            },
            {
                'key': 'food',
                'question': _('What food do you prefer?'),
                'options': [
                    {'label': _('Chicken'), 'value': 'chicken'},
                    {'label': _('Beef'), 'value': 'beef'},
                    {'label': _('Fish'), 'value': 'fish'},
                    {'label': _('Vegetarian'), 'value': 'vegetarian'},
                ],
            },
            {
                'key': 'alcohol',
                'question': _('What alcohol do you drink, and about how much?'),
                'type': 'text',
                'placeholder': _('Example: Red wine, 2 glasses'),
                'shortcuts': [
                    {'label': _("I don't drink alcohol"), 'value': _("I don't drink alcohol")},
                ],
            },
            {
                'key': 'soft_drinks',
                'question': _('What soft drinks would you like available, and how much?'),
                'type': 'text',
                'placeholder': _('Example: Coke Zero, 2 cans'),
                'shortcuts': [
                    {'label': _('No soft drinks for me'), 'value': _('No soft drinks for me')},
                ],
            },
            {
                'key': 'music',
                'question': _('What songs would you like us to play?'),
                'type': 'music',
                'placeholder': _('Type a song title'),
            },
        ],
    }
    return render(request, 'RSVP.html', {'rsvp_translations': rsvp_translations})


@require_POST
def RSVPSubmitView(request):
    try:
        payload = json.loads(request.body or '{}')
    except json.JSONDecodeError:
        return JsonResponse({'ok': False, 'error': 'Invalid JSON payload.'}, status=400)

    guest_name = str(payload.get('guest_name', '')).strip()
    attendance = str(payload.get('attendance', '')).strip()
    driving = str(payload.get('driving', '')).strip()
    food = str(payload.get('food', '')).strip()
    alcohol = str(payload.get('alcohol', '')).strip()
    soft_drinks = str(payload.get('soft_drinks', '')).strip()
    music = str(payload.get('music', '')).strip()

    if not guest_name or not attendance:
        return JsonResponse({'ok': False, 'error': 'Name and attendance are required.'}, status=400)

    ceremony_only = attendance == 'no_ceremony_only'
    if not ceremony_only and (not driving or not food or not alcohol or not soft_drinks or not music):
        return JsonResponse({'ok': False, 'error': 'Please answer all RSVP questions before submitting.'}, status=400)

    submission = RSVPSubmission.objects.create(
        guest_name=guest_name,
        attendance=attendance,
        driving=driving,
        food=food,
        alcohol=alcohol,
        soft_drinks=soft_drinks,
        music=music,
    )

    return JsonResponse({'ok': True, 'id': submission.id})

def AboutPageView(request):
    context = {
        'about_style_text': translated_copy(
            request,
            """We'd love our wedding to feel like a soft, romantic fairytale - think flowing silhouettes, natural textures, and a touch of playful elegance.
For outfits, we're imagining longer dresses in earthy, floral-inspired tones: soft greens, warm browns, dusty pinks, muted blues, and other gentle, nature-inspired shades. Light, airy fabrics and relaxed fits are very much in the spirit.

Feel free to have fun with accessories! Hair pieces, delicate jewelry, scarves, or anything a little whimsical are more than welcome - this is your chance to add a personal, magical touch.
The only thing we kindly ask is to avoid very bright or bold colors (such as strong reds, bright greens, or vibrant yellows), so we can keep the overall look cohesive and dreamy.

If it helps, picture something between a garden fairytale and a period drama - soft, romantic, and just a little bit enchanting.""",
            """Ми дуже хочемо, щоб наше весілля відчувалося як ніжна романтична казка - уявіть собі легкі силуети, природні текстури та трішки грайливої елегантності.
Щодо вбрання, ми бачимо довші сукні в землистих, квіткових відтінках: м'які зелені, теплі коричневі, припилені рожеві, приглушені блакитні та інші ніжні природні кольори. Легкі тканини та вільні фасони дуже пасують настрою.

Сміливо грайтеся з аксесуарами! Прикраси для волосся, делікатні прикраси, шарфи чи будь-що трохи казкове тільки вітається - це ваш шанс додати особистий і чарівний акцент.
Єдине, про що ми просимо, - уникати дуже яскравих або надто насичених кольорів (наприклад, сильних червоних, яскраво-зелених чи насичено-жовтих), щоб загальний вигляд залишався цілісним і мрійливим.

Якщо це допоможе, уявіть щось між садовою казкою та історичною драмою - ніжно, романтично і трохи чарівно.""",
        ),
        'ladies_note': translated_copy(
            request,
            """Please do not be afraid to go all out. It would be such a cool party, wouldn't it?
Just don't go bankrupt.""",
            """Будь ласка, не бійтеся викластися на повну. Це ж була б неймовірно стильна вечірка, правда?
Тільки не збанкрутуйте.""",
        ),
        'gentlemen_note': _("I know you will not go all out, and that's okay. Just maybe a little flower somewhere?"),
        'accommodation_note': _("We will be renting the place for 2 nights - so on the second night we decide what we wish to do - but mostly clean up and recover. Fishing is allowed."),
        'qa_take_text': _("If you are going with us to accommodation, take the outfit for the second day, something to sleep in, and swimsuit if you would want to chill in kubilas in the evening. Any fun table games are appreciated too."),
        'qa_rsvp_text': _("We would love to hear from you on or before January 20. Please RSVP through this website or get in touch with us."),
        'qa_photos_text': _("We will be having an unplugged ceremony, so we kindly request that phones and cameras be kept out of sight until after the ceremony is concluded. You are welcome to take photos during the cocktail hour, reception, and after party."),
        'qa_kids_text': _("No kids - the place will not be suitable for the kids and we will swear and drink a lot. If you get a baby - please leave them at the comfort of their home and have a party for a bit."),
    }
    return render(request, 'about.html', context)
