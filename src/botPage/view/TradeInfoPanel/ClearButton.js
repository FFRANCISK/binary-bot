import React from 'react';
import { useSelector } from 'react-redux';
import { observer as globalObserver } from '../../../common/utils/observer';
import { showDialog } from '../../bot/tools';
import { translate } from '../../../common/utils/tools';

const ClearButton = () => {
    const { is_bot_running } = useSelector(state => state.ui);
    const [is_button_disabled, setIsButtonDisabled] = React.useState(true);

    React.useEffect(() => {
        globalObserver.register('summary.enable_clear', () => setIsButtonDisabled(false));
        globalObserver.register('summary.disable_clear', () => setIsButtonDisabled(true));
        globalObserver.register('bot.running', () => setIsButtonDisabled(true));
    }, []);

    React.useEffect(() => {
        if (is_bot_running === false) {
            setIsButtonDisabled(false);
        }
    }, [is_bot_running]);

    globalObserver.register('bot.stop', () => setIsButtonDisabled(false));

    const confirmClearLog = () => {
        showDialog({
            title: translate('Are you sure?'),
            text: [
                translate(
                    'This will clear all transactions in the summary panel, and all counters will be reset to zero.'
                ),
            ],
        })
            .then(() => globalObserver.emit('summary.clear'))
            .catch(() => {});
    };
    return (
        <button
            title='Clear summary log'
            id='summaryClearButton'
            className='toolbox-button icon-clear'
            onClick={confirmClearLog}
            disabled={is_button_disabled}
        />
    );
};

export default ClearButton;
