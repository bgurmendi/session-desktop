import { ipcRenderer } from 'electron';
import { useEffect } from 'react';
import { useOverlayChooseAction } from './useOverlayChooseAction';

/**
 * This custom hook should be called once, when the user is logged in.
 * When a `sessionmessenger://add#<accountId>` link is opened (see main_node.ts), it opens the
 * new message overlay with the account id prefilled.
 */
export function useContactLinkListener() {
  const { openNewMessage } = useOverlayChooseAction();

  useEffect(() => {
    const takePendingLink = async () => {
      const accountId = await ipcRenderer.invoke('take-pending-contact-link');
      if (typeof accountId === 'string' && accountId) {
        openNewMessage(accountId);
      }
    };

    // a link may have launched the app before we were ready
    void takePendingLink();

    const ipcCallback = () => {
      void takePendingLink();
    };
    ipcRenderer.on('contact-link-available', ipcCallback);
    return () => {
      ipcRenderer.removeListener('contact-link-available', ipcCallback);
    };
  }, [openNewMessage]);
}
