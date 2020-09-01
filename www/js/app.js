var $$ = Dom7;

var app = new Framework7({
    root: '#app',
    name: 'LaRiba',
    theme: 'ios',
    version: 2.5,
    routes: routes,
    init: false,
    dialog: {
        buttonOk: 'Ок',
        buttonCancel: 'Отмена'
    },
    touch: {
        mdTouchRipple: false,
        tapHold: false,
        disableContextMenu: true,
        activeState: true,
        fastClicks: true
    },
    toast: {
        closeTimeout: 4000
    },
    smartSelect: {
        pageBackLinkText: 'Назад',
        popupCloseLinkText: 'Готово',
        sheetCloseLinkText: 'Выбрать'
    },
    picker: {
        toolbarCloseText: 'Выбрать'
    },
    view: {
        animate: false,
        iosDynamicNavbar: false,
        //mdPageLoadDelay: 100,
        stackPages: true,
        preloadPreviousPage: true,
        removeElements: false,
        iosSwipeBack: true,
        mdSwipeBack: true,
        iosSwipeBackAnimateShadow: false,
        iosSwipeBackAnimateOpacity: false,
        mdSwipeBackAnimateShadow: false,
        mdSwipeBackAnimateOpacity: false
    },
    photoBrowser: {
        backLinkText: 'Закрыть',
        navbarOfText: 'из',
        popupCloseLinkText: 'Закрыть',
        swiper: {
            lazy: {
                enabled: false
            }
        }
    },
    lazy: {
        placeholder: 'img/no_image.png',
        threshold: 1000,
        sequential: false
    },
    statusbar: {
        iosOverlaysWebView: false,
        androidOverlaysWebView: false,
        iosTextColor: 'white',
        androidTextColor: 'white',
        iosBackgroundColor: '#0056f6',
        androidBackgroundColor: '#0056f6'
    },
    sheetModal: {
        closeByOutsideClick: true,
        swipeToClose: true,
        sheetCloseLinkText: 'Выбрать',
        backdrop: true
    },
    navbar: {
        collapseLargeTitleOnScroll: false
    },
    methods: {
        backButton: function (closeApp = true) {

            if (closeApp) {

                if (app.views.current.router.url === '/main' || app.views.current.router.url === '/cart' || app.views.current.router.url === '/favorites' || app.views.current.router.url === '/profile') {

                    app.dialog.confirm('Вы уверены что хотите закрыть приложение?', function () {

                        navigator.app.exitApp();

                    });

                    return false;

                } else if (app.views.current.router.url === '/catalog/categories') {

                    $$('.views').find('.tab-active').find('.page-current').find('.navbar').find('.left').find('a').click();

                    return false;

                } else if (app.views.current.router.url === '/profile/chat') {

                    $$('.views').find('.tab-active').find('.page-current').find('.navbar').find('.left').find('a').click();

                    return false;

                }

            }

            if ($$('.popover.modal-in').length > 0) {

                var popover;

                if ($$('.popover.modal-in').length > 1) {

                    popover = app.popover.get($$('.popover.modal-in:last-child'));

                } else {

                    popover = app.popover.get($$('.popover.modal-in'));

                }

                popover.close();

                return false;

            }

            if ($$('.dialog.modal-in').length > 0) {

                var dialog;

                if ($$('.dialog.modal-in').length > 1) {

                    dialog = app.dialog.get($$('.dialog.modal-in:last-child'));

                } else {

                    dialog = app.dialog.get($$('.dialog.modal-in'));

                }

                dialog.close();

                return false;

            }

            if ($$('.popup.modal-in').length > 0) {

                var popup;

                if ($$('.popup.modal-in').length > 1) {

                    popup = app.popup.get($$('.popup.modal-in:last-child'));

                } else {

                    popup = app.popup.get($$('.popup.modal-in'));

                }

                popup.close();

                return false;

            }

            if ($$('.sheet-modal.modal-in').length > 0) {

                var popup;

                if ($$('.sheet-modal.modal-in').length > 1) {

                    sheet = app.sheet.get($$('.sheet-modal.modal-in:last-child'));

                } else {

                    sheet = app.sheet.get($$('.sheet-modal.modal-in'));

                }

                sheet.close();

                return false;

            }

            app.views.current.router.back();

        },
        onesignal: function () {

            try {

                window.plugins.OneSignal.startInit('93555334-b167-4cfd-882c-63b733a773d8').endInit();

                window.plugins.OneSignal.getIds(function(ids) {

                    var deviceId = JSON.stringify(ids.userId);

                    localStorage.deviceId = deviceId;

                    if (!app.params.user) {

                        app.request({
                            url: encodeURI(app.params.config.backend2+'/includes/remove-device.php'),
                            method: 'POST',
                            data: {
                                deviceId: localStorage.deviceId
                            }
                        });

                    }

                });

            } catch (error) {

                console.log(error);

            }

        },
        base64ToUrl: function (base64) {

            try {

                let blob = this.methods.base64ToBlob(base64, 'image/png');
                let url = URL.createObjectURL(blob);

                return url;

            } catch (error) {

                return 'img/no_image.png';

            }

        },
        base64ToBlob: function (b64Data, contentType='image/png', sliceSize=512) {

            const byteCharacters = atob(b64Data);
            const byteArrays = [];

            for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                const slice = byteCharacters.slice(offset, offset + sliceSize);

                const byteNumbers = new Array(slice.length);
                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                const byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }

            const blob = new Blob(byteArrays, {type: contentType});
            return blob;

        },
        getRates: function () {

            app.request({
                url: 'https://opt-1289289.ssl.1c-bitrix-cdn.ru/bitrix/templates/universesite_s1/js/rates.js',
                success: function (response) {

                    eval(response);

                    localStorage.rates = JSON.stringify(laRibaCalculatorRates.rates);

                }
            });

        },
        checkVersion: function (callback) {

            var app = this;

            app.request({
                url: 'http://umakhan.tmweb.ru/lariba-config.php',
                dataType: 'json',
                async: false,
                success: function (response) {

                    var config = response;

                    app.params.config = config;

                    localStorage.config = JSON.stringify(config);

                    let InAppBrowserParams = 'toolbarposition=top,closebuttoncolor=#FF8C00,closebuttoncaption=Закрыть,navigationbuttoncolor=#FF8C00,toolbarcolor=#eeeeee,hideurlbar=yes,fullscreen=no';

                    var version;

                    if (app.device.android) {

                        version = config.vers.android;

                    } else if (app.device.ios) {

                        version = config.vers.ios;

                    } else {

                        version = config.version;

                    }

                    let sheet = app.sheet.create({
                        content: `

                            <div class="sheet-modal sheet-update">
                            
                                <div class="sheet-modal-inner">
                                
                                    <div class="block-title block-title-large">Вышла новая версия</div>
                                    
                                    <div class="margin">Мы выпустили новую версию приложения в которой исправили ошибки и повысили производительность. Настоятельно рекомендуем вам обновить приложение.</div>
                                
                                    <div class="margin">
                                    
                                        <button class="button button-fill button-large">Обновить</button>
                                    
                                    </div>
                                
                                </div>
                            
                            </div>

                        `,
                        backdrop: true,
                        closeByBackdropClick: true,
                        closeByOutsideClick: true,
                        swipeToClose: true,
                        on: {
                            opened: function (sheet) {

                                sheet.$el.find('.button').on('click', function () {

                                    sheet.close();

                                    if (app.device.ios) {

                                        cordova.InAppBrowser.open(config.updateLink.ios, '_system', InAppBrowserParams);

                                    } else {

                                        cordova.InAppBrowser.open(config.updateLink.android, '_system', InAppBrowserParams);

                                    }

                                });

                            }
                        }
                    });

                    if (version > app.version) {

                        setTimeout(function () {

                            sheet.open();

                        }, 2000);

                    }

                },
                complete: function () {

                    callback();

                }
            });

        }
    },
    on: {
        init: function () {

        }
    }
});

$$(document).on('deviceready', function () {

    try {

        Keyboard.shrinkView(true);
        Keyboard.disableScrollingInShrinkView(true);

    } catch (error) {}

    setTimeout(function () {

        if (app.device.ios) {

            app.statusbar.hide();
            app.statusbar.show();

        }

        navigator.splashscreen.hide();

    }, 1500);

    app.init();

    app.request.setup({
        beforeSend: function(xhr) {

        },
        complete: function(xhr) {

            console.log(xhr);

        },
        error: function () {

        }
    });

    if (localStorage.config) {

        app.params.config = JSON.parse(localStorage.config);

    }

    app.methods.checkVersion(function () {

        app.methods.getRates();

        app.views.create('#view-main', {
            url: '/main',
            //animate: app.device.ios ? true : false,
            main: true
        });

        app.views.create('#view-plans', {
            url: '/plans',
            //animate: app.device.ios ? true : false
        });

        app.views.create('#view-calc', {
            url: '/calc',
            //animate: app.device.ios ? true : false
        });

        app.views.create('#view-help', {
            url: '/help',
            //animate: app.device.ios ? true : false
        });

        app.views.create('#view-contacts', {
            url: '/contacts',
            //animate: app.device.ios ? true : false
        });

    });

    if (!app.device.ios) {

        let attachFastClick = Origami.fastclick;

        attachFastClick(document.body);

    }

    $$(window).on('keypress', 'input', function (e) {

        if (e.which == 13) {

            document.activeElement.blur();

            $$(this).blur();

            try {

                Keyboard.hide();

            } catch (error) {

            }

        }

    });

    $$(window).on('touchmove', function (e) {

        document.activeElement.blur();

        $$('input').blur();

        try {

            Keyboard.hide();

        } catch (error) {

        }

    });

    $$(window).on('click', '.input-clear-button', function() {

        $$(this).prev().val('').focus();

    });

    $$(window).on('keyboardWillShow', function () {

        $$('.toolbar-menu').css('visibility', 'hidden');

    });

    $$(window).on('keyboardWillHide', function () {

        setTimeout(function () {

            $$('.toolbar-menu').css('visibility', 'visible');

        }, app.device.ios ? 100 : 0);

    });

    $$(document).on('backbutton', function (event) {

        app.methods.backButton();

    });

    $$(document).on('tab:show', function () {

        var first = true;

        $$(document).off('click', '.toolbar-menu .tab-link-active').on('click', '.toolbar-menu .tab-link-active', function (event) {

            if (!first) {

                var viewId = $$(this).attr('href');
                var view = app.views.get(viewId);
                var viewUrl = view.params.url;

                if (viewId !== '#view-profile') {

                    view.router.back(viewUrl, {
                        force: true
                    });

                }

                //app.methods.backButton(false);

            }

            first = false;

        });

    });

});
